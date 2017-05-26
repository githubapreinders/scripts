var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var wordSchema = new Schema({
    mainword: String,
    lidw: {type:String,default:""},
    description: {type:String,default:""},
    type: {type:String,default:""},
    subtype:{type:String,default:""},
    plural: {type:String,default:""},
    verb : {type:Array, default:[]},
    adjective:{attrib:{type:String,default:""}, exagg:{type:String,default:""}, super:{type:String,default:""}},
    synonyms : {type:Array,default:[]},
    generalizations: {type:Array,default:[]},
    specifications : {type:Array,default:[]},
    vowelbase : {type:String,default:""},
    anagrambase : {type:String,default:""}});

var Word = mongoose.model('Word',wordSchema);
module.exports = Word;

