

girder.views.kwcnn_ConfusionView = girder.View.extend({
    events: {
        'contextmenu .g-render-target': '_ignore',
        'mousedown .g-render-target': '_ignore',
        'selectstart .g-render-target': '_ignore',
        'mousewheel .g-render-target': '_ignore',
        'click .confusion_element': '_element_callback',
    },

    _ignore: function () {
        return false;
    },

    _element_callback: function(e) {
        this.e = e;
        //console.log(JSON.stringify(e));
        $('#image_display').empty();
        var ix = $(e.target).attr('data_ix');
        var iy = $(e.target).attr('data_iy');
        console.log(iy+" "+ix);
        var imageIDs = this.data.confusion_image_ids[iy][ix];

        $('#image_display').html("Classified as "+ix+": ");

        for(var i = 0; i < imageIDs.length; i++){
            $('<img>')
                .appendTo($('#image_display'))
                .attr("src", "/api/v1/file/"+imageIDs[i]+"/download");
        }
    },

    initialize: function (settings) {
        this.file = settings.file;
        this.testImage = settings.testImage;
        this.item = settings.item;
    },

    render: function () {
        //console.log(JSON.stringify(this.testImage));
        // todo: use underscore for this
        var self = this;
        // We could look for the file name in "this.files.models"
        // We could also have all the  file ids in som json structure.  The
        // first file in the item.  Hard code the json file id for now.
        $.ajax({
            type: "get",
            url: this.file.downloadUrl(),
            success: function(data,status) {
                console.log(data);
                self._initConfusion(data);
            },
            error: function() {
                alert("json file failed");
            }
        });
    },

    _initConfusion: function (data) {
        this.data = data;
        this.$el.html(girder.templates.kwcnn_confusion(
            {matrix: data.confusion_matrix,
             image_url: this.testImage}));
        console.log(JSON.stringify(data));
    },

    

});

