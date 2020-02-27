export default function(target) {
    // div = document.getElementById("chart") // un selecteur 
    // let target = document.getElementById("chart");
    var svg = target.getElementsByTagName('svg')[0];

    // get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    //add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    // var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    
    return source;
}
