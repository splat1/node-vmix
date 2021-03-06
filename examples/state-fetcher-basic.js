// Import modules from the package
// Note: when using npm swap in: 'node-vmix' instead of '../index'
const { ConnectionTCP } = require('../dist/index')
const { InputMapper, StateFetcher } = require('vmix-js-utils')

// Modules
const connection = new ConnectionTCP('localhost', 8088)
const stateFetcher = new StateFetcher(connection)

// Register callback on state fetcher success
// When data is fetched, what to do with it?
stateFetcher.onSuccess(data => {
    // Manipulate data
    let xmlContent = ApiDataParser.parse(data)
    let inputs = InputMapper.extractInputsFromXML(xmlContent)
    let inputsMap = InputMapper.mapInputs(inputs)
    let inputsList = Object.values(inputsMap)

    console.log("I did read from the vMix API! Inputs: ", inputs.length)
})

stateFetcher.onError(error => {
    console.error(`Error.. Not able to read API data from a vMix web controller.. Trying again in ${stateFetcher.currentRefreshRate()}ms`)
    //console.error(error)
})

// Start the state fetcher - it then runs 10 times a second
stateFetcher.start()