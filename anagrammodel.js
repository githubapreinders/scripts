var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var anagramSchema = new Schema({
    actualword: {type:String, default:""},
    motherword: {type:String, default:""},
    synonyms:{type:Array, default:[]},
    synonymprefixes:{type:Array,default:[]},
    lidw:{type:String,default:""},
    type:{type:String, default:""},
    subtype:{type:String, default:""},
    description:{type:String, default:""},
    vowelbase: {type:String, default:""},
    anagram: {type:String, default:""},
    numletters:{type: Number,default:0},
    oneword:{type: Boolean, default:true},
    referenceId: String,
    rhymewords:Array,default:[],
    variations:Array,default:[]
});


var Anagram = mongoose.model('Anagram',anagramSchema);
module.exports = Anagram;

