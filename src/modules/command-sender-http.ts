import axios from 'axios'
import querystring from 'querystring'

import ConnectionHTTP from './connection-http'

import { Command } from '../types/command'

//
export class CommandSenderHTTP {
    protected onError: Function
    protected onSuccess: Function

    protected _connection!: ConnectionHTTP

    constructor(connection: ConnectionHTTP, onSuccess: Function, onError: Function) {
        this.setConnection(connection)

        this.onError = onError
        this.onSuccess = onSuccess
    }

    // Prepare promise
    protected preparePromise(commands: Command[]) {

        // If only one command were coded - send via get request
        if (!Array.isArray(commands)) {
            let command = commands

            return axios.get(this._connection.apiUrl(), { params: command })
        }

        // If multiple commands - send via POST request

        // Manipulate commands for being sent in POST request
        let commandsMap = commands.map(command => {
            return querystring.stringify(command)
        })

        let data = {
            Function: 'ScriptStartDynamic',
            Value: commandsMap.join("\n\r")
        }

        let dataString = querystring.stringify(data)

        return axios.post(this._connection.apiUrl(), dataString)
    }

    /**
     * Set the vMix connection used to know the endpoint for the vMix instance
     * @param {Connection} connection 
     */
    setConnection(connection: ConnectionHTTP) {
        this._connection = connection
    }

    send(commands: Command[], onSuccess: Function, onError: Function) {

        let promise = this.preparePromise(commands)

        promise
            .then((response: any) => {
                this.onSuccess && this.onSuccess(response)
                onSuccess && onSuccess(response)
            })
            .catch((error: any) => {
                this.onError && this.onError(error)
                onError && onError(error)
            })

        return promise
    }
}

export default CommandSenderHTTP
