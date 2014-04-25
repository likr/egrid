/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts" />
declare module egrid.model {
    class ValueObject<T> {
        private value_;
        constructor(v: T);
        public value : T;
        public toString(): string;
    }
}
declare module egrid.model.interfaces {
    interface IEntity {
        key: string;
    }
}
declare module egrid.utils {
    var API_URL_BASE: string;
    class Api {
        static get<T>(name: string, projectId: string, participantId?: string): JQueryPromise<T>;
        static post<T>(data: T, name: string, projectId?: string): JQueryPromise<T>;
        static put<T>(data: T, name: string, projectId: string, participantId?: string): JQueryPromise<T>;
        static remove(name: string, projectId: string, participantId?: string): JQueryPromise<any>;
        static retrieve<T extends model.interfaces.IEntity>(name: string, projectId?: string): JQueryPromise<T[]>;
    }
    class Storage {
        private static key;
        private static outOfService;
        private store;
        constructor();
        private flush<T extends model.interfaces.IEntity>();
        public add<T extends model.interfaces.IEntity>(value: T, name: string, projectId?: string, participantId?: string): JQueryPromise<T>;
        public get<T extends model.interfaces.IEntity>(name: string, projectId: string, participantId?: string): JQueryPromise<T>;
        public remove<T extends model.interfaces.IEntity>(name: string, projectId: string, participantId?: string): JQueryPromise<boolean>;
        public retrieve<T extends model.interfaces.IEntity>(name: string, projectId?: string): JQueryPromise<any>;
    }
    class Miscellaneousness {
        static merge(o?: any, b?: any): any;
        static construct(...properties: string[]): any;
    }
}
declare module egrid {
    var storage: utils.Storage;
}
declare module egrid.model {
    class Entity implements interfaces.IEntity {
        private key_;
        static type: string;
        public key : string;
        public load(o: any): Entity;
        public get(key: string): JQueryPromise<Entity>;
        public save(): JQueryPromise<Entity>;
        static listUrl(key?: string): string;
        public url(key?: string): string;
        public toJSON(t: any): any;
    }
}
declare module egrid.model {
    class Dictionary<TValue> {
        private pairs;
        public getItem(k: string): TValue;
        public removeItem(k: string): void;
        public setItem(k: string, v: TValue): void;
        public toArray(): TValue[];
        public toJSON(): any;
    }
    class NotationDeserializer {
        static load(o: any): any[];
    }
    class CollectionBase<T extends Entity> {
        private pairs_;
        constructor(pairs: Dictionary<T>);
        public pairs : ValueObject<Dictionary<T>>;
        public addItem(item: T): void;
        public getItem(k: string): T;
        public removeItem(k: string): void;
        public query(key?: string): JQueryPromise<T[]>;
        public toArray(): T[];
        static pluralize(word: string): string;
    }
}
declare module egrid.model {
    interface ProjectData {
        name: string;
        note: string;
    }
    class Project extends Entity {
        private createdAt_;
        private updatedAt_;
        public name: string;
        public note: string;
        static type: string;
        constructor(obj?: ProjectData);
        public createdAt : Date;
        public updatedAt : Date;
        private setCreatedAt(date);
        private setUpdatedAt(date);
        public load(o: any): Project;
        static load(o: any): Project;
        public get(key: string): JQueryPromise<Project>;
        static get(key: string): JQueryPromise<Project>;
        public save(): JQueryPromise<Project>;
        static listUrl(): string;
        public url(key?: string): string;
        public remove(): JQueryPromise<boolean>;
    }
}
declare module egrid.model {
    interface UserData {
        email?: string;
        location?: string;
        nickname?: string;
    }
    class User implements UserData {
        private key_;
        public email: string;
        public location: string;
        public nickname: string;
    }
}
declare module egrid.model {
    interface CollaboratorData {
        isManager?: boolean;
        project?: ProjectData;
        projectKey: string;
        user?: UserData;
        userEmail?: string;
    }
    class Collaborator extends Entity {
        public isManager: boolean;
        public project: ProjectData;
        public projectKey: string;
        public user: UserData;
        public userEmail: string;
        static type: string;
        static url: string;
        constructor(obj?: CollaboratorData);
        public load(o: any): Collaborator;
        public get(key: string): JQueryPromise<Collaborator>;
        public save(): JQueryPromise<Collaborator>;
        static listUrl(key?: string): string;
        public url(key?: string): string;
        public remove(): JQueryPromise<boolean>;
    }
}
declare module egrid.model {
    class CollaboratorCollection extends CollectionBase<Collaborator> {
        constructor();
        public query(projectKey?: string): JQueryPromise<Collaborator[]>;
        public getItem(k: string): Collaborator;
    }
}
declare module egrid.model {
    interface ParticipantData {
        name?: string;
        note?: string;
        project?: ProjectData;
        projectKey: string;
    }
    class Participant extends Entity {
        private createdAt_;
        private updatedAt_;
        public name: string;
        public note: string;
        public project: ProjectData;
        public projectKey: string;
        static type: string;
        static url: string;
        constructor(obj?: ParticipantData);
        public createdAt : Date;
        public updatedAt : Date;
        private setCreatedAt(date);
        private setUpdatedAt(date);
        public load(o: any): Participant;
        public get(key: string): JQueryPromise<Participant>;
        public save(): JQueryPromise<Participant>;
        static listUrl(key?: string): string;
        public url(key?: string): string;
        public remove(): JQueryPromise<boolean>;
    }
}
declare module egrid.model {
    class ParticipantCollection extends CollectionBase<Participant> {
        constructor();
        public query(projectKey?: string): JQueryPromise<Participant[]>;
    }
}
declare module egrid.model {
    interface ParticipantGridNodeData {
        text: string;
        weight: number;
        original: boolean;
    }
}
declare module egrid.model {
    interface ParticipantGridLinkData {
        source: number;
        target: number;
        weight: number;
    }
}
declare module egrid.model {
    interface ParticipantGridData {
        projectKey: string;
        participantKey: string;
        nodes: ParticipantGridNodeData[];
        links: ParticipantGridLinkData[];
    }
    class ParticipantGrid implements ParticipantGridData, interfaces.IEntity {
        public key: string;
        public participantKey: string;
        public projectKey: string;
        public nodes: ParticipantGridNodeData[];
        public links: ParticipantGridLinkData[];
        static type: string;
        constructor(obj: ParticipantGridData);
        public update(): JQueryPromise<ParticipantGrid>;
        private url();
        static get(projectKey: string, participantKey: string): JQueryPromise<ParticipantGrid>;
        private static url(projectKey, participantKey);
    }
}
declare module egrid.model {
    class ProjectCollection extends CollectionBase<Project> {
        constructor();
        public query(key?: string): JQueryPromise<Project[]>;
        static query(): JQueryPromise<Project[]>;
    }
}
declare module egrid.model {
    interface ProjectGridNodeData extends ParticipantGridNodeData {
        participants: string[];
    }
}
declare module egrid.model {
    interface ProjectGridLinkData extends ParticipantGridLinkData {
    }
}
declare module egrid.model {
    interface ProjectGridData {
        projectKey: string;
        nodes?: ProjectGridNodeData[];
        links?: ProjectGridLinkData[];
        name?: string;
        note?: string;
    }
    class ProjectGrid implements ProjectGridData, interfaces.IEntity {
        private key_;
        private createdAt_;
        private updatedAt_;
        public name: string;
        public note: string;
        public projectKey: string;
        public nodes: ProjectGridNodeData[];
        public links: ProjectGridLinkData[];
        static type: string;
        constructor(obj: ProjectGridData);
        public key : string;
        public createdAt : Date;
        public updatedAt : Date;
        public save(): JQueryPromise<ProjectGrid>;
        private url();
        private load(obj);
        static get(projectKey: string, projectGridId?: string): JQueryPromise<ProjectGrid>;
        static query(projectKey: string): JQueryPromise<ProjectGrid>;
        private static load(obj);
        private static url(projectKey, projectGridKey?);
    }
}
declare module egrid.model {
    interface SemProjectData {
        name?: string;
        project?: ProjectData;
        projectKey: string;
    }
    class SemProject extends Entity {
        private createdAt_;
        private updatedAt_;
        public name: string;
        public project: ProjectData;
        public projectKey: string;
        static type: string;
        static url: string;
        constructor(obj?: SemProjectData);
        public createdAt : Date;
        public updatedAt : Date;
        private setCreatedAt(date);
        private setUpdatedAt(date);
        public load(o: any): SemProject;
        public get(key: string): JQueryPromise<SemProject>;
        public save(): JQueryPromise<SemProject>;
        static listUrl(key?: string): string;
        public url(key?: string): string;
    }
}
declare module egrid.model {
    class SemProjectCollection extends CollectionBase<SemProject> {
        constructor();
        public query(projectKey?: string): JQueryPromise<SemProject[]>;
    }
}
declare module egrid.model {
    interface QuestionnaireItem {
        title: string;
        description: string;
    }
    interface SemProjectQuestionnaireData {
        description?: string;
        items?: QuestionnaireItem[];
        projectKey: string;
        semProjectKey: string;
        title?: string;
    }
    class SemProjectQuestionnaire implements SemProjectQuestionnaireData {
        public description: string;
        public items: QuestionnaireItem[];
        public projectKey: string;
        public semProjectKey: string;
        public title: string;
        constructor(obj: SemProjectQuestionnaireData);
        public save(): JQueryXHR;
        private url();
        static get(projectKey: string, semProjectKey: string): JQueryXHR;
        private static url(projectKey, semProjectKey);
    }
}
