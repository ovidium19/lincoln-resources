module.exports = function(application){
  "use strict";
  application.factory("convertData",[function(){
    "use strict";
    //when we get data, we receive an array, therefore we have to specify isArray in the resource method definition
    function sectionize(data){
      let newData = [{
        blockname: "Main Page",
        name: "Main Page",
        sections:[]
      }];
      let videoSection = {
        "subtitle": "Introduction Video",
        "components":[data[0].mainVideo]
      };
      let quotesSection = {
        "subtitle": "Quotes",
        "components":[{
          "type": "quote-list",
          "list_elements":[]
        }]};
      for (let k in data[0].quotes){
        quotesSection.components[0].list_elements.push(data[0].quotes[k]);
      }
      quotesSection.components[0].list_elements.forEach(q => {q.embolden = true});
      let textSection = {
        "subtitle": "Main Paragraph",
        "components": [{
          "type": "text-alert",
          "text": data[0].mainParagraph.text
        }]};
      let contactSection  = data[0].contact;
      let affiliationSection = {
        "subtitle": "Affilliations",
        "components":[{
          "type": "list-images",
          "list_elements": data[0].affiliations
        }]
      };
      let siteSection = {
        "subtitle": "Useful Sites",
        "components":[{
          "type": "list-images",
          "list_elements": data[0].useful_sites
        }]
      };
      let backgroundUpSection = {
        "subtitle": "background_up",
        "components": [{
          "type": "image-single",
          "src": data[0].background_up.src.slice(2)
        }]
      };
      let backgroundDownSection = {
        "subtitle": "background_down",
        "components": [{
          "type": "image-single",
          "src": data[0].background_down.src.slice(2)
        }]
      };
      newData[0].sections.push(videoSection,quotesSection,textSection,contactSection,affiliationSection,siteSection,backgroundUpSection,backgroundDownSection);
      return newData;
    }
    function unsectionize(data){
      let newData = [{
          mainVideo: {},
          quotes:[],
          mainParagraph: {},
          contact:[],
          affiliations: [],
          useful_sites:[]
      }];
      for (let i=0;i<data.sections.length;i++){
        let block  = data.sections[i];
        switch (block.subtitle){
            case 'Introduction Video':
              newData[0].mainVideo = block.components[0];
              break;
            case 'Quotes':
              newData[0].quotes = block.components[0].list_elements;
              break;
            case 'Main Paragraph':
              newData[0].mainParagraph = {text: block.components[0].text};
              break;
            case 'Affilliations':
                newData[0].affiliations = block.components[0].list_elements;
                break;
            case 'Useful Sites':
                newData[0].useful_sites = block.components[0].list_elements;
                break;
          case 'background_up':
          case 'background_down':
                newData[0][block.subtitle] = {src: ".."+block.components[0].src};
                break;
            default:
              newData[0].contact = block;
        }
      }
      console.log(newData);
      return newData;
    }
    return{
        sectionize,
        unsectionize
    }
  }]);
};
