// SPDX-License-Identifier: BUSL-1.1
// Last deployed from commit: 19d9982858f4feeff1ca98cbf31b07304a79ac7f;
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../../interfaces/facets/arbitrum/IGLPRewarder.sol";
import "../../interfaces/facets/arbitrum/IRewardRouterV2.sol";
import "../../interfaces/facets/arbitrum/IRewardTracker.sol";
import "../../ReentrancyGuardKeccak.sol";
import {DiamondStorageLib} from "../../lib/DiamondStorageLib.sol";
import "../../OnlyOwnerOrInsolvent.sol";
import "../../interfaces/ITokenManager.sol";

//This path is updated during deployment
import "../../lib/local/DeploymentConstants.sol";

contract GLPFacetArbi is ReentrancyGuardKeccak, OnlyOwnerOrInsolvent {
    using TransferHelper for address;

    // Used to claim GLP fees
    address private constant REWARD_ROUTER_ADDRESS = 0x159854e14A862Df9E39E1D128b8e5F70B4A3cE9B;
    // Used to mint/redeem GLP
    address private constant GLP_REWARD_ROUTER_ADDRESS = 0xB95DB5B167D75e6d04227CfFFA61069348d271F5;
    // Used to approve tokens to mint GLP with
    address private constant GLP_MANAGER_ADDRESS = 0x3963FfC9dff443c2A94f21b129D429891E32ec18;
    // sGLP
    address private constant GLP_TOKEN_ADDRESS = 0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf;

    function claimGLpFees() external nonReentrant onlyOwner noBorrowInTheSameBlock remainsSolvent {
        IRewardRouterV2 rewardRouter = IRewardRouterV2(REWARD_ROUTER_ADDRESS);
        IRewardTracker rewardTracker = IRewardTracker(rewardRouter.feeGlpTracker());
        ITokenManager tokenManager = DeploymentConstants.getTokenManager();

        require(rewardTracker.claimable(address(this)) > 0, "There are no claimable fees");

        IERC20Metadata wethToken = getERC20TokenInstance("ETH", false);
        uint256 initialWethBalance = wethToken.balanceOf(address(this));

        rewardRouter.claimFees();

        uint256 postClaimingWethBalance = wethToken.balanceOf(address(this));
        uint256 wethClaimed = postClaimingWethBalance - initialWethBalance;

        _increaseExposure(tokenManager, address(wethToken), wethClaimed);

        emit GLPFeesClaim(msg.sender, wethClaimed, block.timestamp);
    }

    function mintAndStakeGlp(address _token, uint256 _amount, uint256 _minUsdg, uint256 _minGlp) external nonReentrant onlyOwner noBorrowInTheSameBlock remainsSolvent{
        ITokenManager tokenManager = DeploymentConstants.getTokenManager();
        require(tokenManager.isTokenAssetActive(GLP_TOKEN_ADDRESS), "GLP not supported.");
        require(tokenManager.isTokenAssetActive(_token), "Asset not supported.");

        require(_amount > 0, "Amount of GLP to mint  has to be greater than 0");

        IERC20Metadata tokenToMintWith = IERC20Metadata(_token);
        bytes32 tokenToMintWithSymbol = tokenManager.tokenAddressToSymbol(_token);
        IGLPRewarder glpRewarder = IGLPRewarder(GLP_REWARD_ROUTER_ADDRESS);
        IERC20Metadata glpToken = IERC20Metadata(GLP_TOKEN_ADDRESS);

        uint256 glpInitialBalance = glpToken.balanceOf(address(this));

        _amount = Math.min(tokenToMintWith.balanceOf(address(this)), _amount);

        _token.safeApprove(GLP_MANAGER_ADDRESS, 0);
        _token.safeApprove(GLP_MANAGER_ADDRESS, _amount);

        uint256 glpOutputAmount = glpRewarder.mintAndStakeGlp(_token, _amount, _minUsdg, _minGlp);

        require((glpToken.balanceOf(address(this)) - glpInitialBalance) == glpOutputAmount, "GLP minted and balance difference mismatch");
        require(glpOutputAmount >=_minGlp, "Insufficient output amount");

        _increaseExposure(tokenManager, GLP_TOKEN_ADDRESS, glpOutputAmount);
        _decreaseExposure(tokenManager, _token, _amount);

        emit GLPMint(
            msg.sender,
            tokenToMintWithSymbol,
            _amount,
            glpOutputAmount,
            block.timestamp
        );

    }

    function unstakeAndRedeemGlp(address _tokenOut, uint256 _glpAmount, uint256 _minOut) external nonReentrant onlyOwnerOrInsolvent noBorrowInTheSameBlock   {
        ITokenManager tokenManager = DeploymentConstants.getTokenManager();
        require(tokenManager.isTokenAssetActive(_tokenOut), "Asset not supported.");

        require(_glpAmount > 0, "Amount of GLP to redeem has to be greater than 0");

        IERC20Metadata redeemedToken = IERC20Metadata(_tokenOut);
        bytes32 redeemedTokenSymbol = tokenManager.tokenAddressToSymbol(_tokenOut);
        IGLPRewarder glpRewarder = IGLPRewarder(GLP_REWARD_ROUTER_ADDRESS);
        IERC20Metadata glpToken = IERC20Metadata(GLP_TOKEN_ADDRESS);

        uint256 redeemedTokenInitialBalance = redeemedToken.balanceOf(address(this));
        _glpAmount = Math.min(glpToken.balanceOf(address(this)), _glpAmount);

        uint256 redeemedAmount = glpRewarder.unstakeAndRedeemGlp(_tokenOut, _glpAmount, _minOut, address(this));

        require((redeemedToken.balanceOf(address(this)) - redeemedTokenInitialBalance) == redeemedAmount, "Redeemed token amount and balance difference mismatch");
        require(redeemedAmount >= _minOut, "Insufficient output amount");

        _decreaseExposure(tokenManager, GLP_TOKEN_ADDRESS, _glpAmount);
        _increaseExposure(tokenManager, _tokenOut, redeemedAmount);

        emit GLPRedemption(
            msg.sender,
            redeemedTokenSymbol,
            _glpAmount,
            redeemedAmount,
            block.timestamp
        );

    }

    modifier onlyOwner() {
        DiamondStorageLib.enforceIsContractOwner();
        _;
    }

    /**
     * @dev emitted after a GLP token mint
     * @param user the address of user minting GLP
     * @param tokenToMintWith token which GLP was minted with
     * @param tokenToMintWithAmount amount of token used to mint GLP
     * @param glpOutputAmount amount of GLP minted
     * @param timestamp time of the mint
     **/
    event GLPMint(address indexed user, bytes32 indexed tokenToMintWith, uint256 tokenToMintWithAmount, uint256 glpOutputAmount, uint256 timestamp);

    /**
  * @dev emitted after a GLP token redemption
  * @param user the address of user redeeming GLP
  * @param redeemedToken token which GLP was redeemed into
  * @param glpRedeemedAmount amount of GLP redeemed
  * @param redeemedTokenAmount amount of redeemedToken redeemed
  * @param timestamp time of the redemption
  **/
    event GLPRedemption(address indexed user, bytes32 indexed redeemedToken, uint256 glpRedeemedAmount, uint256 redeemedTokenAmount, uint256 timestamp);

    /**
    * @dev emitted after claiming GLP fees
    * @param user the address of user claiming fees
    * @param wethAmountClaimed amount of weth fees that were claimed
    * @param timestamp time of claiming the fees
    **/
    event GLPFeesClaim(address indexed user, uint256 wethAmountClaimed, uint256 timestamp);
}
