import * as $PouchDB from 'pouchdb';
import * as $PouchAuth from 'pouchdb-authentication';
const PouchDB = $PouchDB['default'];
const PouchAuth = $PouchAuth['default'];
import { ConnectionService } from '../_services/connection.service';
import { DatabaseService } from '../_services/database.service';
import { User } from '../_types/user';
export class Query {
    private designDoc;
    private connection;
    private db;
    private creatingQuery: boolean;
    private localQueryDB: any;
    private remoteQueryDB: any;
    private activeUser: User;
    constructor(queryName, formTypes, tabNames, sectionNames, questionKeys, wherePredicates = null,
        private connService: ConnectionService, 
        private dbService: DatabaseService
    ) {
        this.creatingQuery = false;
        this.connService.connection().subscribe(conn => {
            this.activeUser = this.dbService.activeUser.getValue();
            this.connection = conn;
            if (this.connection) {
                // change os 50 to the final database when possible;
                this.db = new PouchDB(`http://wkoformbuilder.eastus.cloudapp.azure.com/couchdb/os50/_design`);
                this.remoteQueryDB = new PouchDB(`http://wkoformbuilder.eastus.cloudapp.azure.com/couchdb/queries`);
                this.localQueryDB = new PouchDB(`${this.activeUser.getName()}_queries`);
                this.localQueryDB.crypto(this.activeUser.getPassword(), {ignore: '_attachments'});
                this.syncQueryDB().then(result => {
                    if(!result.success) {
                        throw new Error('Query Databases failed to sync');
                    } else {
                        this.designDoc = {
                            _id: `_design/${queryName}`,
                            views: {
                                index: {
                                    map: (doc) => {
                                        if(formTypes.indexOf(doc.form.name) >= 0) {
                                            doc.form.tabs.map(tab => {
                                                //if (tabNames.indexOf(tab.name) >= 0) {
                                                    tab.sections.map(section => {
                                                        //if(sectionNames.indexOf(section.name) >= 0) {
                                                            section.rows.map(row => {
                                                                row.columns.map(column => {
                                                                    const tableColumns = [];
                                                                    column.questions.map(question => {
                                                                        if (questionKeys.indexOf(question.key)) {
                                                                            tableColumns.push({key: question.key, value: question.input});
                                                                        }
                                                                    });
                                                                    const tableRow = {columns: tableColumns};
                                                                    PouchDB.emit(tableRow).toString();
                                                                })
                                                            })
                                                        //}
                                                    })
                                                //}
                                            })
                                        }
                                    }
                                }
                            },
                        }
                    }
                })
                
            } else {
                this.localQueryDB = new PouchDB(`${this.activeUser.getName()}_queries`);
                this.localQueryDB.crypto(this.activeUser.getPassword(), {ignore: '_attachments'});
                throw new Error('offline')
            }
        })
        
        
    }
    public isCreatingQuery() {
        return this.creatingQuery;
    }
    public beginSave() {
        this.creatingQuery = true;
    }
    public endSave() {
        this.creatingQuery = false;
    }
    public save() {
        this.beginSave();
        this.db.put(this.designDoc).then(result => {
          
            this.endSave();
        }).catch(err => {
        
        })
    }

    public createMap(...args: any[]) {

    }

    public createReduce() {

    }

    public syncQueryDB() {
        if (this.connection) {
           return this.remoteQueryDB.sync(this.localQueryDB).then(() => {
                return {success: true}
            }).catch(err => {
                return {success: false, err};
            })
        }
    }

    public queryStore() {
        if(this.connection) {
            return this.remoteQueryDB;
        } else {
            return this.localQueryDB;
        }
    }
}
