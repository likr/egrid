/// <reference path="dagre.d.ts" />
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts" />
/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts" />
declare module Svg {
    module Transform {
        class Translate {
            public x: number;
            public y: number;
            constructor(x: number, y: number);
            public toString(): string;
        }
        class Scale {
            public sx: number;
            public sy: number;
            constructor(sx: number, sy?: number);
            public toString(): string;
        }
        class Rotate {
            public angle: number;
            constructor(angle: number);
            public toString(): string;
        }
    }
    class Point {
        public x: number;
        public y: number;
        constructor(x: number, y: number);
    }
    class Rect {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public theta: number;
        constructor(x: number, y: number, width: number, height: number, theta?: number);
        public left(): Point;
        public right(): Point;
        public top(): Point;
        public bottom(): Point;
        public center(): Point;
        static left(x: number, y: number, width: number, height: number, theta?: number): Point;
        static right(x: number, y: number, width: number, height: number, theta?: number): Point;
        static top(x: number, y: number, width: number, height: number, theta?: number): Point;
        static bottom(x: number, y: number, width: number, height: number, theta?: number): Point;
        static center(x: number, y: number, width: number, height: number, theta?: number): Point;
    }
    class ViewBox {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        constructor(x: number, y: number, width: number, height: number);
        public toString(): string;
    }
}
declare module egrid {
    interface NodeData {
        text: string;
        weight: number;
        original: boolean;
    }
    interface LinkData {
        source: number;
        target: number;
        weight: number;
    }
    interface GridData {
        nodes: NodeData[];
        links: LinkData[];
    }
    class Node implements NodeData {
        public index: number;
        public x: number;
        public y: number;
        public baseWidth: number;
        public baseHeight: number;
        public width: number;
        public height: number;
        public theta: number;
        public text: string;
        public dagre: any;
        public weight: number;
        public key: number;
        public original: boolean;
        public isTop: boolean;
        public isBottom: boolean;
        public active: boolean;
        public participants: string[];
        private static nextKey;
        constructor(text: string, weight?: number, original?: boolean, participants?: string[]);
        public left(): Svg.Point;
        public right(): Svg.Point;
        public top(): Svg.Point;
        public bottom(): Svg.Point;
        public center(): Svg.Point;
        public toString(): string;
    }
    class Link {
        public source: Node;
        public target: Node;
        public index: number;
        public points: Svg.Point[];
        public previousPoints: Svg.Point[];
        public dagre: any;
        public weight: number;
        public key: number;
        private static nextKey;
        constructor(source: Node, target: Node, weight?: number);
        public toString(): string;
    }
    enum RankDirection {
        LR = 0,
        TB = 1,
    }
    interface LayoutOption {
        lineUpTop?: boolean;
        lineUpBottom?: boolean;
        rankDirection?: RankDirection;
    }
    class Grid {
        private nodes_;
        private links_;
        private paths;
        private linkMatrix;
        private pathMatrix;
        private undoStack;
        private redoStack;
        private transaction;
        private checkActive_;
        private minimumWeight_;
        constructor();
        public appendNode(node: Node): void;
        public appendLink(sourceIndex: number, targetIndex: number): Link;
        public removeNode(removeNodeIndex: number): void;
        public removeLink(removeLinkIndex: number): void;
        public updateNodeText(nodeIndex: number, newText: string): void;
        public updateNodeWeight(nodeIndex: number, newWeight: number): void;
        public updateNodeParticipants(nodeIndex: number, newParticipants: string[]): void;
        public updateLinkWeight(linkIndex: number, newWeight: number): void;
        public incrementLinkWeight(linkIndex: number): void;
        public decrementLinkWeight(linkIndex: number): void;
        public mergeNode(fromIndex: number, toIndex: number): void;
        public radderUpAppend(fromIndex: number, newNode: Node): void;
        public radderUp(fromIndex: number, toIndex: number): Link;
        public radderDownAppend(fromIndex: number, newNode: Node): void;
        public radderDown(fromIndex: number, toIndex: number): Link;
        public canUndo(): boolean;
        public undo(): void;
        public canRedo(): boolean;
        public redo(): void;
        public toJSON(): GridData;
        public nodes(): Node[];
        public nodes(nodes: Node[]): Grid;
        public activeNodes(): Node[];
        public findNode(text: string): Node;
        public links(): Link[];
        public links(links: Link[]): Grid;
        public activeLinks(): Link[];
        public link(linkIndex: number): Link;
        public link(fromNodeIndex: number, toNodeIndex: number): Link;
        public layout(options: LayoutOption): void;
        public hasPath(fromIndex: number, toIndex: number): boolean;
        public hasLink(fromIndex: number, toIndex: number): boolean;
        public numConnectedNodes(index: number): number;
        public checkActive(): boolean;
        public checkActive(flag: boolean): Grid;
        public minimumWeight(): number;
        public minimumWeight(value: number): Grid;
        private execute(command);
        private transactionWith(f);
        private beginTransaction();
        private commitTransaction();
        private rollbackTransaction();
        private updateConnections();
        private updateNodeIndex();
        private updateLinkIndex();
        private updateIndex();
    }
}
declare module egrid {
    class DAG {
        private grid_;
        private uiCallback;
        constructor();
        public grid(): Grid;
        public nodes(): Node[];
        public nodes(nodes: Node[]): DAG;
        public links(): Link[];
        public links(links: Link[]): DAG;
        public notify(): DAG;
        public registerUiCallback(callback: () => void): DAG;
        public undo(): DAG;
        public redo(): DAG;
        public draw(): DAG;
        public focusCenter(): DAG;
        public display(regionWidth?: number, regionHeight?: number): (selection: D3.Selection) => void;
    }
}
declare module egrid {
    enum ViewMode {
        Normal = 0,
        Edge = 1,
        EdgeAndOriginal = 2,
    }
    enum InactiveNode {
        Hidden = 0,
        Transparent = 1,
    }
    enum ScaleType {
        Connection = 0,
        None = 1,
        Weight = 2,
    }
    class EgmOption {
        public viewMode: ViewMode;
        public inactiveNode: InactiveNode;
        public maxScale: number;
        public scaleType: ScaleType;
        public lineUpTop: boolean;
        public lineUpBottom: boolean;
        public showGuide: boolean;
        public rankDirection: RankDirection;
        public minimumWeight: number;
    }
    interface DragNode {
        (selection: D3.Selection): DragNode;
        isDroppable(f: (from: Node, to: Node) => boolean): DragNode;
        dragToNode(f: (from: Node, to: Node) => void): DragNode;
        dragToOther(f: (from: Node) => void): DragNode;
    }
    enum Raddering {
        RadderUp = 0,
        RadderDown = 1,
    }
    class EGM extends DAG {
        private static rx;
        private options_;
        private displayWidth;
        private displayHeight;
        private rootSelection;
        private contentsSelection;
        private contentsZoomBehavior;
        public openLadderUpPrompt: (callback: (result: string) => void) => void;
        public openLadderDownPrompt: (callback: (result: string) => void) => void;
        private removeLinkButtonEnabled;
        constructor();
        public options(): EgmOption;
        public options(options: EgmOption): EGM;
        public exportSVG(c: (svgText: string) => void): EGM;
        public draw(): EGM;
        private drawNodeConnection();
        private getTextBBox(text);
        private calcRect(text);
        private appendElement();
        private appendRemoveLinkButton();
        private scaleValue(node);
        private nodeSizeScale();
        private linkWidthScale();
        private rescale();
        public resize(width: number, height: number): void;
        public display(regionWidth?: number, regionHeight?: number): (selection: D3.Selection) => void;
        private createGuide(selection);
        private drawGuide();
        private createNode(text);
        public focusNode(node: Node): void;
        public focusCenter(animate?: boolean): EGM;
        public selectElement(selection: D3.Selection): void;
        public selectedNode(): Node;
        public unselectElement(): void;
        public dragNode(): DragNode;
        public raddering(selection: D3.Selection, type: Raddering): void;
        private getPos(container);
        public showRemoveLinkButton(): boolean;
        public showRemoveLinkButton(flag: boolean): EGM;
        public appendNode(text: string): EGM;
        public removeSelectedNode(): EGM;
        public removeNode(node: Node): EGM;
        public mergeNode(fromNode: Node, toNode: Node): EGM;
        public editSelectedNode(text: string): EGM;
        public editNode(node: Node, text: string): EGM;
    }
}
declare module egrid {
    interface AppendNodeButton {
        (selection: D3.Selection): AppendNodeButton;
        onClick(f: (callback: (result: string) => void) => void): AppendNodeButton;
    }
    interface RemoveNodeButton {
        (selection: D3.Selection): RemoveNodeButton;
        onEnable(f: (selection: D3.Selection) => void): RemoveNodeButton;
        onDisable(f: () => void): RemoveNodeButton;
    }
    interface MergeNodeButton {
        (selection: D3.Selection): MergeNodeButton;
        onEnable(f: (selection: D3.Selection) => void): MergeNodeButton;
        onDisable(f: () => void): MergeNodeButton;
    }
    interface EditNodeButton {
        (selection: D3.Selection): EditNodeButton;
        onClick(f: (callback: (result: string) => void) => void): EditNodeButton;
        onEnable(f: (selection: D3.Selection) => void): EditNodeButton;
        onDisable(f: () => void): EditNodeButton;
    }
    interface RadderUpButton {
        (selection: D3.Selection): RadderUpButton;
        onClick(f: (callback: (result: string) => void) => void): RadderUpButton;
        onEnable(f: (selection: D3.Selection) => void): RadderUpButton;
        onDisable(f: () => void): RadderUpButton;
    }
    interface RadderDownButton {
        (selection: D3.Selection): RadderDownButton;
        onClick(f: (callback: (result: string) => void) => void): RadderDownButton;
        onEnable(f: (selection: D3.Selection) => void): RadderDownButton;
        onDisable(f: () => void): RadderDownButton;
    }
    interface UndoButton {
        (selection: D3.Selection): UndoButton;
        onEnable(f: () => void): UndoButton;
        onDisable(f: () => void): UndoButton;
    }
    interface RedoButton {
        (selection: D3.Selection): RedoButton;
        onEnable(f: () => void): RedoButton;
        onDisable(f: () => void): RedoButton;
    }
    interface SaveButton {
        (selection: D3.Selection): SaveButton;
        save(f: (json: GridData) => void): SaveButton;
    }
    class EGMUi {
        private egm_;
        private onEnableRemoveNodeButton;
        private onDisableRemoveNodeButton;
        private onEnableMergeNodeButton;
        private onDisableMergeNodeButton;
        private onEnableEditNodeButton;
        private onDisableEditNodeButton;
        private onEnableRadderUpButton;
        private onDisableRadderUpButton;
        private onEnableRadderDownButton;
        private onDisableRadderDownButton;
        private onEnableUndoButton;
        private onDisableUndoButton;
        private onEnableRedoButton;
        private onDisableRedoButton;
        private onClickSaveButton;
        constructor();
        public egm(): EGM;
        public appendNodeButton(): AppendNodeButton;
        public removeNodeButton(): RemoveNodeButton;
        public mergeNodeButton(): MergeNodeButton;
        public editNodeButton(): EditNodeButton;
        public radderUpButton(): RadderUpButton;
        public radderDownButton(): RadderDownButton;
        public saveButton(): SaveButton;
        public undoButton(): UndoButton;
        public redoButton(): RedoButton;
        private updateNodeButtons();
        private enableNodeButtons();
        private disableNodeButtons();
        private enableRadderUpButton(selection);
        private disableRadderUpButton();
        private enableRadderDownButton(selection);
        private disableRadderDownButton();
        private enableRemoveNodeButton(selection);
        private disableRemoveNodeButton();
        private enableMergeNodeButton(selection);
        private disableMergeNodeButton();
        private enableEditNodeButton(selection);
        private disableEditNodeButton();
        private enableUndoButton();
        private disableUndoButton();
        private enableRedoButton();
        private disableRedoButton();
        private updateUndoButton();
        private updateRedoButton();
    }
    function egmui(): EGMUi;
}
declare module egrid {
    class SEM extends DAG {
        private static rx;
        private displayWidth;
        private displayHeight;
        private rootSelection;
        private contentsSelection;
        private contentsZoomBehavior;
        private removeLinkButtonEnabled;
        public draw(): SEM;
        private getTextBBox(text);
        private calcRect(text);
        private appendElement();
        private appendRemoveLinkButton();
        private nodeSizeScale();
        private linkWidthScale();
        private rescale();
        public display(regionWidth?: number, regionHeight?: number): (selection: D3.Selection) => void;
        public focusCenter(): SEM;
        public activeNodes(): Node[];
        public activeLinks(): Link[];
        private dragNode();
        private getPos(container);
        public appendNode(text: string): DAG;
        private createNode(text);
    }
    function sem(): SEM;
}
