/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>
/// <reference path="value-object.ts"/>

module egrid.model {
  export interface ProjectData {
    name: string;
    note: string;
  }


  interface ApiProjectData extends ProjectData {
    key: string;
    createdAt: string;
    updatedAt: string;
  }


  /**
  * @class Project
  */
  export class Project extends Entity {
    private createdAt_: ValueObject<Date>;
    private updatedAt_: ValueObject<Date>;

    public name: string;
    public note: string;

    constructor(obj? : ProjectData) {
      super();

      if (obj) {
        this.name = obj.name;
        this.note = obj.note;
      }
    }

    public get createdAt() : Date {
      return this.createdAt_.vomit();
    }

    public get updatedAt() : Date {
      return this.updatedAt_.vomit();
    }

    // Accessors は同じ Accessibility を持っていなければいけないのでメソッドを用意する
    private setCreatedAt(date: Date) : void {
      if (!this.createdAt_)
        this.createdAt_ = new ValueObject<Date>(date);
    }

    private setUpdatedAt(date: Date) : void {
      if (!this.updatedAt_)
        this.updatedAt_ = new ValueObject<Date>(date);
    }

    /**
     * Object から Project に変換します。
     *
     * @override
     * @param   object
     */
    public deserialize(o: any): Entity {
      this.key = o.key;

      this.name = o.name;
      this.note = o.note;

      this.setCreatedAt(o.createdAt);
      this.setUpdatedAt(o.updatedAt);

      return this;
    }

    /**
     * @override
     */
    public fetch(key: string): JQueryPromise<Project> {
      var $deferred = $.Deferred();

      $.ajax({
          url: this.url(key),
          type: 'GET',
          dataFilter: data => {
            var obj : ApiProjectData = JSON.parse(data);

            return this.deserialize(obj);
          },
        })
        .then((project : Project) => {
          return $deferred.resolve(project);
        }, () => {
          var target: Project = JSON
            .parse(window.localStorage.getItem(Collection.pluralize(this.getType())))
            .map((o: any) => {
              return this.deserialize(o);
            })
            .filter((value: Project) => {
              return value.key === key;
            });

          return target ? $deferred.resolve(target[0]) : $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * クラス情報を取得します。
     *
     * @override
     */
    public getType(): string {
      return 'Project';
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @override
     * @throws  Error
     */
    public publish(): JQueryPromise<Project> {
      var $deferred = $.Deferred();

      return $.ajax({
          url: this.url(),
          type: this.key ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: this.key,
            name: this.name,
            note: this.note,
          }),
          dataFilter: data => {
            var obj : ApiProjectData = JSON.parse(data);

            return new Project().deserialize(obj);
          },
        })
        .then((p: Project) => {
            return $deferred.resolve(p);
          }, (...reasons) => {
            var o = {};
            var key = 'unsavedItems.' + Collection.pluralize(this.getType());
            var unsavedItems: any[];

            o[this.key] = this;

            unsavedItems = $.extend({}, JSON.parse(window.localStorage.getItem(key)), o);

            window.localStorage.setItem(key, JSON.stringify(unsavedItems));

            return $deferred.reject();
          });

      return $deferred.promise();
    }

    /**
     * @override
     */
    public url(key? : string) : string {
      var destination = '/api/projects';

      if (this.key) {
        return destination + '/' + this.key;
      } else if (key) {
        return destination + '/' + key;
      } else {
        return destination;
      }
    }

    public remove() : JQueryXHR {
      return $.ajax({
        url: this.url(),
        type: 'DELETE',
      });
    }
  }
}
