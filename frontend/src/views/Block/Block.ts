import { Options, Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Block as ChainBlock, Transaction } from "@/models/blockchain-node";

@Options({ name: "Block" })
export default class Block extends Vue {
    @Prop(Number) readonly index: number;

    @Prop({ type: Object, required: true }) readonly block: ChainBlock;

    timestamp() {
        return new Date(this.block.timestamp).toLocaleTimeString();
    }

    formattedTransactions(): string {
        return this.block.transactions
            .map(
                (t: Transaction) => `${t.sender} → ${t.recipient}: $${t.amount}`
            )
            .join("\n");
    }
}
