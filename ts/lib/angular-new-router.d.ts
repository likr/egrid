interface Route {
  path: string;
  redirectTo?: string;
  component?: string;
  components?: {[viewportName: string]: string};
  as?: string;
}

interface IRouterService {
  navigate: (url: string) => any;
  generate: (name: string, params: any) => any;
}
