const handlebars = require('handlebars')

handlebars.registerHelper("obtenerColorFondo", function(index, max){
    if(index < 4){
        return "primeros4";
    }
    if(index >= (max - 4)){
        return "ultimos4";
    }
    return;
})

handlebars.registerHelper("log", function(something) {
    console.log(something);
  });
