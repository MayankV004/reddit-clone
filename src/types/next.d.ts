import 'next';

declare module 'next' {
  export declare type LayoutParams<Params extends string = string> = {
    params: {
      [key in Params]: string;
    };
    children: React.ReactNode;
  };

  export declare type PageParams<Params extends string = string> = {
    params: {
      [key in Params]: string;
    };
  };
}