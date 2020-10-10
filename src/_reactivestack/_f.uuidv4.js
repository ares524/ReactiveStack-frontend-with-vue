import {v4} from "uuid";

const uuidv4 = () => v4().replace(/-/g, "");
export default uuidv4;