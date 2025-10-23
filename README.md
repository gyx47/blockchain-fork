# 浙大彩票

> 第二次作业要求（以下内容提交时可以删除）：
> 
> 进阶的去中心化彩票系统，参与方包括：竞猜玩家、公证人
>
> **背景**：传统的体育彩票系统（例如我国的体育彩票）一般没有彩票交易功能：例如，对于“NBA本赛季MVP为某球员/F1的赛季总冠军为某车队”这类持续时间长的事件的下注一般在赛季开始前就会买定离手，这使得一旦出现突发或不确定事件（如球员A赛季报销/球队B买入强力球星/C车队车手受伤等），很多玩家的选择便会立即失去意义，导致彩票游戏的可玩性下降。因此，一个有趣的探索方向是让彩票系统拥有合规、方便的交易功能。
>
> 建立一个进阶的去中心化彩票系统（可以是体育彩票，或其它任何比赛节目的竞猜，例如《中国好声音》《我是歌手》年度总冠军等，可以参考 [Polymarket](./img/https://polymarket.com/) ），在网站中：
> - 公证人（你自己）可以创立许多竞猜项目：例如某场比赛的输赢、年度总冠军的得主等，每个项目应当有2个或多个可能的选项，一定的彩票总金额（由公证人提供），以及规定好的结果公布时间。
> - 玩家首先领取到测试所需以太币。在网站中，对于一个竞猜项目和多个可能的选项：
>   1. 每个竞彩玩家都可以选择其中的某个选项并购买一定金额（自己定义）的彩票，购买后该玩家会获得一张对应的彩票凭证（一个 ERC721 合约中的 Token）
>   2. 在竞彩结果公布之前，任何玩家之间可以买卖他们的彩票，以应对项目进行期间的任何突发状况。具体的买卖机制如下：一个玩家可以以指定的金额挂单出售（ERC721 Delegate）自己的彩票，其它玩家如果觉得该彩票有利可图就可以买入他的彩票。双方完成一次 ERC721 Token 交易。
>   3. 公证人可以在时间截止时（简单起见，你可以随时终止项目）输入竞猜的结果并进行结算。所有胜利的玩家可以平分奖池中的金额。
> - Bonus（最多5分，若想要完成，可以直接将功能整合进上述要求中）：
>   1. （2分）发行一个 ERC20 合约，允许用户领取 ERC20 积分，并使用ERC20积分完成上述流程。
>   2. （3分）对交易彩票的过程实现一个简单的链上订单簿：卖方用户可以以不同价格出售一种彩票，网页上显示当前订单簿的信息（多少价格有多少该彩票正在出售）。其他用户可以根据最优价格购买彩票。
> - 可以对上述需求进行合理更改和说明。请大家专注于功能实现，网站UI美观程度不纳入评分标准，能让用户能够舒适操作即可。

## 如何运行

**步骤**:

1. **启动本地区块链**:
  
  - 打开 Ganache 应用， Quickstart。
  - 把RPC Server 地址 改成 http://127.0.0.1:8545。复制地址和其中一个账户的 Private Key（用于部署合约和作为公证人）。
2. **配置 Hardhat**:
  - 修改 hardhat.config.ts 文件：
    - 把networks.ganache.url 复制为Ganache RPC Server 地址。
    - 把 networks.ganache.accounts 数组中的私钥替换为从 Ganache 复制的账户私钥。
3. **安装合约依赖**:
  - 在 ./contracts 目录下运行:  
    `npm install`  这里遇到了问题，默认安装的@openzeppelin/contracts版本是错的，很多包会找不到，所以手动intall一个版本。还有后面import的ether也需要自己安装@5版本。
4. **编译合约**:
  
  - 在 ./contracts 目录下运行:  
    `npx hardhat compile`
    
  - 编译成功后，在 contracts/artifacts/contracts/EasyBet.sol/ 目录下生成 ABI 文件 (EasyBet.json)。
    
5. **部署合约**:
  
  - 在 ./contracts 目录下运行 (确保 Ganache 正在运行):  
    `npx hardhat run scripts/deploy.ts \--network ganache`
    
  - 部署成功后，终端会输出合约部署到的地址。**复制这个地址**。
    
6. **配置前端**:
  
  - 进入 ./frontend 目录。
  - 打开 src/App.jsx 文件。
  - 找到 const contractAddress = "(现在是我的合约地址)"; 这一行。
  - 将 "(现在是我的合约地址)" 替换为你上一步复制的合约地址。
  -  找到 const contractABI= [] 。将 ./contracts/artifacts/contracts/EasyBet.sol/EasyBet.json 文件中的 abi 数组内容复制并替换掉 App.jsx 中的 [] 部分。
7. **安装前端依赖**: 
  - 在 ./frontend 目录下运行:  
    npm install  
8. **启动前端应用**:
  - 在 ./frontend 目录下运行:  
    npm start  
  - 应用将在浏览器中打开 ( http://localhost:3000)。
    
9. **配置 MetaMask**:
  
  - 确保 MetaMask 已安装并解锁。
  - 将 MetaMask 网络切换到 Ganache 提供的本地网络 (使用 Ganache 的 RPC URL,也就是http:localhost:8545)。
  - 导入 Ganache 账户：在 MetaMask 中，点击账户头像 \-\> Import Account，粘贴 Ganache 中某个账户的 Private Key (建议导入部署合约的账户作为公证人，再导入另一个账户作为普通玩家)。
10. **使用 DApp**:
  
  - 刷新前端页面。
  - 点击 "Connect Wallet" 连接 MetaMask。
  - 如果连接的是部署合约的账户（公证人），将看到 "Notary Actions" 部分，可以创建和结算活动,也可以购买彩票，挂单，购买他人挂单的彩票和领取奖金。
  - 切换到另一个导入的 Ganache 账户（玩家），你可以购买彩票、挂单、购买他人挂单的彩票以及领取奖金。


11. 具体的使用流程请看项目运行截图部分


## 功能实现分析(含订单簿 Bonus +3)

- **项目创建 (createActivity)**: 公证人调用此函数，传入描述、选项数组、结束时间戳，并发送 ETH 作为初始奖池。合约记录项目信息。
  
- **彩票购买 (buyTicket)**: 玩家调用此函数，传入项目 ID、选项索引，并发送 ETH 作为购买金额。合约铸造一个 ERC721 Token 给玩家，记录投注信息，并将 ETH 加入奖池。
  
- **彩票交易**:
  
  - **挂单 (listTicket)**: 玩家先调用 ERC721 的 approve (通过前端触发) 授权合约转移 NFT，然后调用 listTicket 设置价格，合约记录挂单信息。
  - **取消挂单 (cancelListing)**: 卖家调用此函数取消挂单。
  - **购买 (buyListedTicket)**: 买家调用此函数，发送指定价格的 ETH。合约验证支付金额，调用 ERC721 的 transferFrom 转移 NFT，并将 ETH 转给卖家。
- **项目结算 (settleActivity)**: 公证人调用此函数，传入项目 ID 和获胜选项索引。合约标记项目已结束并记录结果。
  
- **奖金领取 (claimWinnings)**: 获胜玩家调用此函数，传入其持有的获胜彩票 Token ID。合约验证条件，计算奖金（基于投注额比例），并将 ETH 转给玩家。奖金计算目前在 claimWinnings 中进行（为了简化部署，但效率不高），理想情况下应在结算时一次性计算或在购买时累积记录获胜投注总额。

- **订单簿实现 (Bonus 2):**
- 链上: 合约保持简单，只存储单个 tokenId 的挂单信息 (listings mapping)，包含卖家地址和 ETH 价格。

- 链下 (前端 App.tsx):

    - fetchData 函数会调用 contract.totalSupply() 获取总票数。
    然后它会循环（从 i = 0 到 totalSupply - 1），对每个索引调用contract.tokenByIndex(i) 来获取 tokenId。对每个 tokenId，它会并行获取 ownerOf, getListing, 和 getTicketInfo。
    - 前端过滤出所有活跃的、非当前用户拥有的挂单，并将它们收集到一个临时数组 allListings 中。接着，代码处理 allListings 数组：按 activityId 和 optionIndex 分组。在每个选项组内，按 price (ETH 价格) 再次分组。统计每个价格层级有多少个 tokenId 可供购买。最终构建出一个嵌套的 orderBooks 状态变量，并渲染到 "Order Books" 栏中。
    - 购买: 当用户点击 "Buy Cheapest" 时，前端会从 orderBooks 状态中取出该价格层级的 tokenIds 列表中的第一个 tokenId，然后调用 handleBuyFromOrderBook 函数，该函数会触发 buyListedTicket(tokenId, { value: price }) 交易。
- **ERC721**: 使用 Ownable (控制公证人权限) 和 ReentrancyGuard (防止重入攻击)。
## 项目运行截图
### 阶段一：链的部署

打开Ganache

<img src="./img/1.png" alt="alt text" style="width:50%;">

修改地址

<img src="./img/9c385e4687e7643dd04dda272d75d5d0.png" alt="alt text" style="width:50%;">

修改 hardhat.config.ts 文件：
    - 把networks.ganache.url 复制为Ganache RPC Server 地址。
    - 把 networks.ganache.accounts 数组中的私钥替换为从 Ganache 复制的账户私钥。
  
<img src="./img/84eacb20-0d24-4854-9b4b-6a1420810197.png" alt="alt text" style="width:50%;">

**编译合约**:
  
  - 在 ./contracts 目录下运行:  
    `npx hardhat compile`
    
  - 编译成功后，在 contracts/artifacts/contracts/EasyBet.sol/ 目录下生成 ABI 文件 (EasyBet.json)。
  
    <img src="./img/5a4537930515293547fcc5a138744f8c.png" alt="alt text" style="width:50%;">

**部署合约**:
  
  - 在 ./contracts 目录下运行 (确保 Ganache 正在运行):  
    `npx hardhat run scripts/deploy.ts \--network ganache`
  - 部署成功后，终端会输出合约部署到的地址。**复制这个地址**。
  
  - <img src="./img/d6acdee5920fbe1f42740b2bc6682d16.png" alt="alt text" style="width:50%;">
  
并且可以看到区块

<img src="./img/b2764837fa67ef60a0020278aad46f5d.png" alt="alt text" style="width:50%;">

1. **配置前端**:
  
  - 进入 ./frontend 目录。
  - 打开 src/App.jsx 文件。
  - 找到 const contractAddress = "(现在是我的合约地址)"; 这一行。
  - 将 "(现在是我的合约地址)" 替换为你上一步复制的合约地址。
  - **(重要)** 找到 const contractABI = [...]。将 ./contracts/artifacts/contracts/EasyBet.sol/EasyBet.json 文件中的 abi 数组内容复制并替换掉 App.jsx 中的 [...] 部分。
<img src="./img/aa41bbfd-13d4-4fb4-9f5a-6f1bb6b2d7af.png" alt="alt text" style="width:50%;">
2. **启动前端应用**:
  - 在 ./frontend 目录下运行:  
    npm start  
    <img src="./img/2a73a068-d80a-49d9-8014-4176a49ea0f0.png" alt="alt text" style="width:50%;">
    <img src="./img/b1841d68-dc7d-45ce-9f8d-272b69cc4e68.png" alt="alt text" style="width:50%;">

  - 应用将在浏览器中打开 ( http://localhost:3000)。
    
**配置 MetaMask**:
浏览器打开后MetaMask会自动弹出。首先要登录。
将 MetaMask 网络切换到 Ganache 提供的本地网络 (使用 Ganache 的 RPC URL,也就是http:localhost:8545)。

<img src="./img/a9af33d0e5ece4819493b04a0e3a25ab.png" alt="alt text" style="width:50%;">
<img src="./img/9e3d29add25621ffd107152cf543bdb0.png" alt="alt text" style="width:50%;">
<img src="./img/c6b8f140c5546eb578f38b5b4d5d50aa.png" alt="alt text" style="width:50%;">
<img src="./img/9039f3a238489438e9131d23563db3b5.png" alt="alt text" style="width:50%;">

导入 Ganache 账户：在 MetaMask 中，点击账户头像 \-\> Import Account，粘贴 Ganache 中账户的 Private Key (公证人账户和几个普通玩家)。

<img src="./img/c4cd6f16-afb8-494d-b18a-c343c5eb947a.png" alt="alt text" style="width:50%;">

在弹出的小狐狸插件点击连接到localhost:3000

<img src="./img/42cc546216123e9c20bea0d1e79a722e.png" alt="alt text" style="width:50%;">

在起始页面点击connect wallet

<img src="./img/04026841-3d85-4fbb-b61b-20e34d9d2ed9.png" alt="alt text" style="width:50%;">

### 阶段二：公证人创建竞猜

先用公证人连接，连接成功后，看到（Notary）和黄色的 "🔑 Notary Actions" 模块，这证明被识别为公证人。

<img src="./img/188b98c022c77aaaabe3cfdd4a317f3c.png" alt="alt text" style="width:50%;">
<img src="./img/e7abbe04b5e074a78799c11d45e3457e.png" alt="alt text" style="width:50%;">

1. **创建活动：**
在 "➕ Create New Activity" 表单中填写Description，Options（逗号隔开），End Time（不能比当前时间小），Initial Pool (ETH)

<img src="./img/d347a6e4c7d61fffaa941115ce57de25.png" alt="alt text" style="width:50%;">

点击 "Create Activity" 按钮，并在 MetaMask 中点击确认交易。
交易确认后，创建的活动会立即出现在左侧的 "🎰 Available Activities" 列表中，状态为 "Active"。

<img src="./img/08de3e67-9880-4c87-a99d-37cd7f7e3b09.png" alt="alt text" style="width:50%;">

同时在ganache产生交易区块

<img src="./img/b16573f2333176f62a72dd94014b41e0.png" alt="alt text" style="width:50%;">

2. **玩家 A 购买彩票**
切换账户：打开 MetaMask，切换到账户2（玩家A）。

<img src="./img/2b972006-618c-46f8-bd73-69aea435d209.png" alt="alt text" style="width:50%;">

获取测试ETH：（如果这个账户没钱）点击 "Get 1 Local Test ETH" 按钮，获取一些测试用的 ETH。

在 "🛒 Buy Ticket" 表单中填写ctivity ID，Option Index，Amount (ETH)
点击 "Buy Ticket" 按钮，并在 MetaMask 中确认交易

<img src="./img/cd40c739e5ab26a67529c9c52d92837d.png" alt="alt text" style="width:50%;">

查看结果：交易确认后：

<img src="./img/b74574619af194c0f2513b140d1db19a.png" alt="alt text" style="width:50%;">

"Available Activities" 列表中的奖池金额（Pool）会增加。

<img src="./img/d9f48bfebd9d175aac096c821250fe9f.png" alt="alt text" style="width:50%;">

"🎟️ My Tickets (NFTs)" 列表中会出现一张新的彩票（例如 Token ID: 1）

<img src="./img/1e99a8a10a8ea63662e8ac8f687ce8f5.png" alt="alt text" style="width:50%;">

3. **玩家 A 出售彩票（交易功能）**
挂单：
在 "🏷️ List Ticket for Sale" 表单中填写Token ID to List: 买的彩票 ID，
Price (ETH):希望的卖出价格。

<img src="./img/c89797de1cd2e710c86b3f2eeb66235f.png" alt="alt text" style="width:50%;">

点击 "Approve & List Ticket" 按钮。
确认交易：
MetaMask 会弹出两次交易确认：
第一次（Approve）：授权合约可以转移你的这张 NFT 彩票。

<img src="./img/c55f89b61af756183d97a99ebd7ff95c.png" alt="alt text" style="width:50%;">

第二次（ListTicket）：正式将彩票挂单。

<img src="./img/ce5366d56da4c3d64e8967caf2197be0.png" alt="alt text" style="width:50%;">

查看结果：
"My Tickets" 列表中的彩票会显示 "Listed for: 多少 ETH"。而且会出现一个cancel按钮，点击了就会取消挂单

<img src="./img/1444dacbce17de7b6bf48379b8ea9e3f.png" alt="alt text" style="width:50%;">

在 "🛒 Marketplace" 列表中也会出现这张彩票。

<img src="./img/60a993c94fd712b2f0a1ea9a83c8a8dd.png" alt="alt text" style="width:50%;">

4. **玩家 B 购买彩票**
切换账户：打开 MetaMask，切换到另一个账户
购买挂单：

在 "🛒 order books (sell orders)" 列表中找到玩家A挂单的彩票。Order Books" 区域应该能看到账户A挂单的彩票，按活动、选项和价格汇总显示。为了能看清整个订单簿的结构我多挂了几张

<img src="./img/440959cc64028b1329f0a423a39be2f3.png" alt="alt text" style="width:50%;">

可以看到每个彩票选项都是分开挂单的。同时一个彩票选项会分成不同的价位，每个价位下有所有该价位彩票的详细信息，包括卖家和彩票金额。点击Buy first的时候会自动购买同一价位下代表金额最高的那一张彩票。

假如想单独购买也可以在详细信息下面选择Buy Pay ETH.
MetaMask 会弹出交易确认，要求你支付挂单的价格(这里用buy first做例子)

<img src="./img/20c3e028e2607ffb934b03ca657b81cd.png" alt="alt text" style="width:50%;">

30价位的银灰有3张，分别买了1,15，5ETH，我想要代表金额最多的一张
交易确认后：
"🛒 order books (sell orders)" 中的彩票消失了。

<img src="./img/842c8461800259c90bc9707dc41eda4e.png" alt="alt text" style="width:50%;">

玩家B（当前账户）："My Tickets" 列表中出现了这张彩票（Token ID: 12）。

<img src="./img/44ad4ab4a350a93ab11a90d093c3e1e7.png" alt="alt text" style="width:50%;">

切换回上一个用户，发现12号彩票已经消失了

<img src="./img/9cba5a2a6dadf515f152cd8728bdd219.png" alt="alt text" style="width:50%;">

ganache里多出一笔交易

<img src="./img/6158d84567ee11f303f5137d92499d46.png" alt="alt text" style="width:50%;">

5. **公证人结算并领取奖金**
打开 MetaMask，切换回账户1（公证人）。
在 "🏁 Settle Activity" 表单中：

<img src="./img/2c52aac748878c56fe513bc506ffbc9f.png" alt="alt text" style="width:50%;">

填写Activity ID，Winning Option。
点击 "Settle Activity" 按钮，并在 MetaMask 中确认交易。

查看结果：
"Available Activities" 列表中的活动状态变为 "Settled (Winner: 0)"。

<img src="./img/350c226bfb36eef1a2fba69db197dfd2.png" alt="alt text" style="width:50%;">

切换账户并领奖：
打开 MetaMask，切换到账户B（因为他现在是彩票的持有者）。

<img src="./img/a28ab8552067a492d8c213a293e1cc63.png" alt="alt text" style="width:50%;">

在 "My Tickets" 列表中，会看到彩票显示为 "WINNER"，并且出现了一个 "Claim Winnings" 按钮。没中奖的则显示为"LOST"
点击 "Claim Winnings" 按钮，并在 MetaMask 中确认交易。

<img src="./img/53d092ed90caad446ec7011b2998d309.png" alt="alt text" style="width:50%;">

交易确认后，玩家B的钱包会收到奖池里的按购买金额比例分配的奖金。彩票状态更新为 "WINNER (Claimed)"。

<img src="./img/11d548e1c9bc840c4ce5dffa9f536f29.png" alt="alt text" style="width:50%;">
<img src="./img/287d15c9b6d1ecd17d1a287a32a737bc.png" alt="alt text" style="width:50%;">
<img src="./img/d53ebee281932deb1601e0e8edccdc04.png" alt="alt text" style="width:50%;">



## 参考内容

- 课程的参考Demo：[DEMOs](./img/https://github.com/LBruyne/blockchain-course-demos)。

- 快速实现 ERC721 [模版](./img/https://wizard.openzeppelin.com/#erc20)。