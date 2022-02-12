import { Options, Vue } from "vue-class-component";
import BlocksPanel from "@/views/BlocksPanel/BlocksPanel.vue";
import PendingTransactionsPanel from "@/views/PendingTransactionsPanel/PendingTransactionsPanel.vue";
import TransactionForm from "@/views/TransactionForm/TransactionForm.vue";

import { Block, BlockchainNode, Transaction } from "@/models/blockchain-node";
import { Message, MessageTypes } from "@/models/messages";
import { WebsocketController } from "@/models/websocket-controller";

const node = new BlockchainNode();
const server = new WebsocketController();

@Options({
    name: "Home",
    components: {
        BlocksPanel,
        PendingTransactionsPanel,
        TransactionForm,
    },
})
export default class Home extends Vue {
    status = "";

    blocks(): Block[] { return node.chain; }

    transactions(): Transaction[] { return node.pendingTransactions; }

    shouldDisableForm(): boolean { return node.isMining || node.chainIsEmpty; }

    shouldDisableGeneration(): boolean { return node.isMining || node.noPendingTransactions; }

    created(): void {
        this.updateStatus();

        server
            .connect(this.handleServerMessages.bind(this))
            .then(this.initializeBlockchainNode.bind(this));
    }

    destroyed(): void {
        server.disconnect();
    }

    updateStatus(): void {
        this.status = node.chainIsEmpty ? '⏳ Initializing the blockchain...'
            : node.isMining ? '⏳ Mining a new block...'
            : node.noPendingTransactions ? "📩 Add one or more transactions."
            : `✅ Ready to mine a new block (transactions: ${node.pendingTransactions.length}).`;
    }

    async initializeBlockchainNode(): Promise<void> {
        const blocks = await server.requestLongestChain();
        if (blocks.length > 0) {
            node.initializeWith(blocks);
        } else {
            await node.initializeWithGenesisBlock();
        }
        this.updateStatus();
    }

    addTransaction(transaction: Transaction): void {
        node.addTransaction(transaction);
        this.updateStatus();
    }

    async generateBlock(): Promise<void> {
        server.requestNewBlock(node.pendingTransactions);
        const miningProcessIsDone = node.mineBlockWith(node.pendingTransactions);

        this.updateStatus();

        const newBlock = await miningProcessIsDone;
        await this.addBlock(newBlock);
    }

    async addBlock(block: Block, notifyOthers = true): Promise<void> {
        try {
            await node.addBlock(block);
            if (notifyOthers) {
                server.announceNewBlock(block);
            }
        } catch (error: any) {
            console.log(error.message);
        }

        this.updateStatus();
    }

    handleServerMessages(message: Message): void | Promise<void> {
        switch (message.type) {
            case MessageTypes.GetLongestChainRequest: return this.handleGetLongestChainRequest(message);
            case MessageTypes.NewBlockRequest       : return this.handleNewBlockRequest(message);
            case MessageTypes.NewBlockAnnouncement  : return this.handleNewBlockAnnouncement(message);
            default: {
                console.log(`Received message of unknown type: "${message.type}"`);
            }
        }
    }

    handleGetLongestChainRequest(message: Message): void {
        server.send({
            type: MessageTypes.GetLongestChainResponse,
            correlationId: message.correlationId,
            payload: node.chain,
        });
    }

    async handleNewBlockRequest(message: Message): Promise<void> {
        const transactions = message.payload as Transaction[];
        const miningProcessIsDone = node.mineBlockWith(transactions);

        this.updateStatus();

        const newBlock = await miningProcessIsDone;
        await this.addBlock(newBlock);
    }

    handleNewBlockAnnouncement(message: Message): void {
        const newBlock = message.payload as Block;
        this.addBlock(newBlock, false);
    }
}