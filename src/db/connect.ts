import { connect } from "mongoose";

const run = async (url: string) => await connect(url);

export default run;
