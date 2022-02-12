import { Prop } from "vue-property-decorator";
import { Options, Vue } from "vue-class-component";
import { Transaction } from "@/models/blockchain-node";

@Options({})
export default class TransactionForm extends Vue {
    @Prop(Boolean) readonly disabled: boolean;

    formValue: Transaction = TransactionForm.defaultFormValue();

    isValid(): boolean {
        return (
            this.formValue.sender &&
            this.formValue.recipient &&
            this.formValue.amount > 0
        );
    }

    handleFormSubmit(): void {
        this.$emit("add-transaction", { ...this.formValue });

        // Reset the form
        this.formValue = TransactionForm.defaultFormValue();
    }

    private static defaultFormValue(): Transaction {
        return {
            sender: "",
            recipient: "",
            amount: 0,
        };
    }
}