import { Prop } from "vue-property-decorator";
import { Options, Vue } from "vue-class-component";
import { Transaction } from "@/models/blockchain-node";

@Options({})
export default class PendingTransactionsPanel extends Vue {
    @Prop(Boolean) readonly disabled: boolean;
    @Prop({ type: Array, required: true }) readonly transactions: Transaction[];

    formattedTransactions(): string {
        return this.transactions
            .map((t: Transaction) => `${t.sender} → ${t.recipient}: $${t.amount}`)
            .join("\n");
    }

    generateBlock(): void {
        this.$emit("generate-block");
    }
}