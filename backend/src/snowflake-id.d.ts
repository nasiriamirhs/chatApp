declare module "snowflake-id" {
  interface SnowflakeOptions {
    mid?: number;
    offset?: number;
  }

  export default class SnowflakeId {
    constructor(options?: SnowflakeOptions);
    generate(): string;
  }
}