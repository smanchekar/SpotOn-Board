import  MainModel       from '../../data/spoton/models';
let mainmodel           = new MainModel();
let spotonschemamodels  = mainmodel.models;

class Assets {
    constructor() {
       
       /**
         * Function to retrieve giftcard personalized image.
         * @param {*} args  giftcard id recieved in query. 
         */
        this.getcdimage = (args) => {
            let image  = '';              
            return spotonschemamodels.carddet.findOne({
               attributes  : ['cardimage'],
               where : { carddetid: args.carddetid}
           }).then((cd) => {
               if(cd)
               {
                   image = cd.cardimage;
                   //console.log(image);                   
               }
               return image;
            });
       }; 

        /**
         * Function used by giftcard email service to get giftcard personalized image base64 string.
         * @param {*} args  giftcard id recieved in query. 
         */

       this.processcdimage = (args,res) =>
       {
            this.getcdimage(args)
            .then((cdimage) =>{
                if(cdimage.length > 0)  
                {  
                    console.log('image size'+ cdimage.length);
                    var base64Data = cdimage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                    var img = Buffer.from(base64Data, 'base64');
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': img.length
                    });
                    res.end(img);
                }
                else
                {
                    res.status(404)        // HTTP status 404: NotFound
                    res.send(args.carddetid + ' image Not found')   
                }
            });
       }
    }    
}
export default new Assets();