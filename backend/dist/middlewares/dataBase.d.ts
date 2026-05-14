import { type Request, type Response, type NextFunction } from "express";
export declare const host: string;
export declare const pool: import("mysql2/promise").Pool;
export declare const signVerify: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const logVerify: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare function doesExist(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function isAuth(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=dataBase.d.ts.map