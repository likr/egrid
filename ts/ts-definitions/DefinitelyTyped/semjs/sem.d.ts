/// <reference path="../jquery/jquery.d.ts"/>

declare module sem {
  module linalg {
    function inv(a: number[][]): number[][];
    function lu_decomposition(a: number[][]): number[][];
    function solve(a: number[][], b: number[]): number[];
  }

  /**
   * pathList converts path-matrix to path-list.
   * @param a square matrix of order n
   * @return array of [i, j, a[i][j]] for all 0 <= i, j <= n such that a[i][j] != 0
   */
  function pathList(a: number[][]): number[][];

  /**
   * pathMatrix converts path-list to path-matrix.
   * @param n order of path-matrix
   * @param alpha  array of [i, j, a[i][j]]
   * @return path-matrix represented as a square matrix of order n
   */
  function pathMatrix(n: number, alpha: number[][]): number[][];

  interface Solver {
    /**
     * Solver() requests computation to a server.
     * @param n order of path-matrix, i.e. a number of variables
     * @param alpha list representation of path-matrix
     * @param sigma
     * @param s variance-covariance matrix of observable variables
     * @return promise object of server response
     */
    (n: number, alpha: number[][], sigma: number[][], s: number[][]): JQueryXHR;

    /**
     * Solver.solve is an alias of Solver().
     */
    solve(n: number, alpha: number[][], sigma: number[][], s: number[][]): JQueryXHR;

    /**
     * get server url.
     * @return current server url
     */
    url(): string;

    /**
     * set server url.
     * @param url new server url
     * @return self
     */
    url(String): Solver;
  }

  function solver(): Solver;

  module stats {
    function corrcoef(x: number[][]): number[][];
    function cov(x: number[][]): number[][];
    function partialcorr(x: number[][]): number[][];
  }

  function totalEffect(a: number[][]): number[][];
}
