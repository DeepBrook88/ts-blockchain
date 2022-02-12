import { Prop } from "vue-property-decorator";
import { Options, Vue } from "vue-class-component";
import { Block } from "@/models/blockchain-node";
import BlockComponent from "@/views/Block/Block.vue";

@Options({
    components: {
        Block: BlockComponent,
    },
})
export default class BlocksPanel extends Vue {
    @Prop({ type: Array, required: true }) readonly blocks: Block[];
}
