/**
 *  Debug Module
 *
 *  Exports
 *      output(text [, name])               -- display output text
 *      clearOutput()                       -- clear display output
 */

define(['jquery'], function ($) {
    "use strict";
    
    var debug = true;
    
    var outputDiv = $('#output').first(),
        outputDivOpen = false;
    
    /**
     * Display output container and appends text as new line.
     * If @param name is passed in, then subsequent output(text, name) calls 
     * with the same @param name will update that particular output line 
     * (as opposed to appending new line)
     *
     * @param {String} text Text string to display in page output
     * @param {String | optional} name Identifier of output line. If exist, update line text instead of append new line
     */
    function output(text, name) {
        if (!outputDivOpen) {
            outputDiv.show();
            outputDivOpen = true;
        }
        
        if (name) {
            var outputLine = outputDiv.find('div[name="' + name + '"]');
            if (outputLine.length) {
                outputLine.text(text);
                return;
            }
        }
        
        outputDiv.append($('<div></div>').text(text).attr('name', name));
    }
    
    /**
     * Clear and hide output container
     */
    function clearOutput() {
        outputDiv.hide().children().remove();
        outputDivOpen = false;
    }   
    
    // Clear and hide output container on click
    outputDiv.click(clearOutput);
    
    return {
        output: debug ? output : function() { },
        clearOutput: clearOutput
    };
});