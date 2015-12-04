/**
 * 瀑布流
 * @param conf
 * @returns {*}
 */
function waterfall(conf){

  return newWaterfall(conf);

  function newWaterfall(conf){

    var ModelWaterfall = {
      col: [],
      height: 0,
      gapY: 10,
      gapX: 40,
      outImgHeight: 60,
      defaultWidth: 220,
      loading: false,
      extend: conf.extend,
      $wrap: conf.$wrap,
      template: conf.cardTemplate,
      queryResult: conf.queryResult
    };

    var gapX = ModelWaterfall.gapX;
    var gapY = ModelWaterfall.gapY;
    var defaultWidth = ModelWaterfall.defaultWidth = conf.defaultWidth;
    $wrap = ModelWaterfall.$wrap
    ModelWaterfall.width= $wrap.width();

    var len = Math.floor((ModelWaterfall.width + gapX ) / (gapX + defaultWidth));
    for(var i=0; i<len; i++){
      ModelWaterfall.col.push(0);
    }

    ModelWaterfall.width = len * ( ModelWaterfall.defaultWidth + gapX ) - gapX
    $wrap.css({
      margin: "0 auto",
      width: ModelWaterfall.width
    });

    var water = {

      load: function (arr) {
        var blockarr = [];
        var gapX = ModelWaterfall.gapX;
        var gapY = ModelWaterfall.gapY;
        var defaultWidth = ModelWaterfall.defaultWidth;
        var $wrap = ModelWaterfall.$wrap;
        var template = ModelWaterfall.template;
        var outImgHeight = ModelWaterfall.outImgHeight;


        _.each(arr, function(value, index){
          blockarr.push(function(){
            var vars = {
              width: defaultWidth,
              height: value.imgHeight + outImgHeight,
              imgsrc: value.imgSrc
            };
            var min = _.min(ModelWaterfall.col);
            var minIndex = _.indexOf(ModelWaterfall.col, min);

            vars.left = minIndex * (vars.width+gapX);
            vars.top = min;
            ModelWaterfall.col[minIndex] += (gapY + vars.height);

            vars = _.extend(vars, ModelWaterfall.extend(value));

            return template(vars)
          }())
        })

        $wrap.append(blockarr.join(''));
        ModelWaterfall.height = _.max(ModelWaterfall.col);
        $wrap.css({
          height: ModelWaterfall.height
        })


        if (ENV.development) {
          Holder.run()
        }

      },

      destory: function(){

      }

    };


    $('.waterfall-wrap').on('scroll mousewheel', function(){

      if (ModelWaterfall.loading){
        return;
      }

      if ( $(this).scrollTop() + $(this).height() > $('#waterfall').height() - 100 ){

        console.log('loading...');
        ModelWaterfall.loading = true;
        ModelWaterfall.queryResult({}, function(arr){
          water.load(arr)
          ModelWaterfall.loading = false;
        });

      }
    });


    ModelWaterfall.queryResult({}, function(arr){
      water.load(arr)
      ModelWaterfall.loading = false;
    });

    return water;

  } // end new

} // end waterfall
