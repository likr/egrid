/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
declare module egrid.model {
    interface StorableData {
        key: string;
        createdAt: Date;
        updatedAt: Date;
    }
    interface SerializedData {
        key: string;
        createdAt: string;
        updatedAt: string;
    }
    class Entity implements StorableData {
        private key_;
        private createdAt_;
        private updatedAt_;
        public key : string;
        public createdAt : Date;
        public updatedAt : Date;
        public persisted(): boolean;
    }
}
declare module egrid.model.storage {
    var API_URL_BASE: string;
    module Api {
        function get<T>(name: string, projectKey: string, key?: string): JQueryPromise<T>;
        function post<T>(data: T, name: string, projectKey?: string): JQueryPromise<T>;
        function put<T>(data: T, name: string, projectKey: string, key?: string): JQueryPromise<T>;
        function remove(name: string, projectKey: string, key?: string): JQueryPromise<void>;
        function retrieve<T extends StorableData>(name: string, projectKey?: string): JQueryPromise<T[]>;
    }
}
declare module egrid.model.storage {
    function add<T extends StorableData>(value: T, name: string, projectId?: string, participantId?: string): JQueryPromise<void>;
    function get<T extends StorableData>(name: string, projectId: string, participantId?: string): JQueryPromise<T>;
    function remove<T extends StorableData>(name: string, projectId: string, participantId?: string): JQueryPromise<void>;
    function retrieve<T extends StorableData>(name: string, projectId?: string): JQueryPromise<any>;
}
declare module egrid.model {
    interface ProjectData {
        name: string;
        note: string;
    }
    class Project extends Entity implements ProjectData {
        public name: string;
        public note: string;
        constructor(obj?: ProjectData);
        static get(key: string): JQueryPromise<Project>;
        static query(): JQueryPromise<Project[]>;
        public save(): JQueryPromise<void>;
        public remove(): JQueryPromise<void>;
    }
}
declare module egrid.model {
    interface AnalysisData {
        name?: string;
        project?: ProjectData;
        projectKey: string;
    }
    class Analysis extends Entity implements AnalysisData {
        public name: string;
        public project: ProjectData;
        public projectKey: string;
        constructor(obj: AnalysisData);
        static get(projectKey: string, key: string): JQueryPromise<Analysis>;
        static query(projectKey: string): JQueryPromise<Analysis[]>;
        public save(): JQueryPromise<void>;
        public remove(): JQueryPromise<void>;
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
        static query(projectKey: string): JQueryPromise<Collaborator[]>;
        public save(): JQueryPromise<void>;
        public remove(): JQueryPromise<void>;
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
        public name: string;
        public note: string;
        public project: ProjectData;
        public projectKey: string;
        constructor(obj?: ParticipantData);
        static get(projectKey: string, key: string): JQueryPromise<Participant>;
        static query(projectKey: string): JQueryPromise<Participant[]>;
        public save(): JQueryPromise<void>;
        public remove(): JQueryPromise<void>;
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
    class ParticipantGrid extends Entity implements ParticipantGridData {
        public participantKey: string;
        public projectKey: string;
        public nodes: ParticipantGridNodeData[];
        public links: ParticipantGridLinkData[];
        static type: string;
        constructor(obj: ParticipantGridData);
        public update(): JQueryPromise<void>;
        static get(projectKey: string, participantKey: string): JQueryPromise<ParticipantGrid>;
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
    interface ProjectGridGroupData {
        children: any[];
    }
}
declare module egrid.model {
    interface ProjectGridData {
        projectKey: string;
        nodes?: ProjectGridNodeData[];
        links?: ProjectGridLinkData[];
        groups?: ProjectGridGroupData[];
        name?: string;
        note?: string;
    }
    class ProjectGrid extends Entity implements ProjectGridData {
        public name: string;
        public note: string;
        public projectKey: string;
        public nodes: ProjectGridNodeData[];
        public links: ProjectGridLinkData[];
        public groups: ProjectGridGroupData[];
        static type: string;
        constructor(obj: ProjectGridData);
        public save(): JQueryPromise<void>;
        private load(obj);
        static get(projectKey: string, key?: string): JQueryPromise<ProjectGrid>;
        static query(projectKey: string): JQueryPromise<ProjectGrid>;
        private static load(obj);
    }
}
declare module egrid.model {
    class Questionnaire extends Entity {
        public projectKey: string;
        public formUrl: string;
        public sheetUrl: string;
        public save(): JQueryPromise<void>;
        static get(projectKey: string, key: string): JQueryPromise<Questionnaire>;
    }
}
declare module egrid.model {
    interface SemProjectData {
        name?: string;
        project?: ProjectData;
        projectKey: string;
    }
    class SemProject extends Entity {
        public name: string;
        public project: ProjectData;
        public projectKey: string;
        static type: string;
        static url: string;
        constructor(obj?: SemProjectData);
        public get(key: string): JQueryPromise<SemProject>;
        static query(projectKey: string): JQueryPromise<SemProject[]>;
        public save(): JQueryPromise<SemProject>;
        static listUrl(key?: string): string;
        public url(key?: string): string;
    }
}
