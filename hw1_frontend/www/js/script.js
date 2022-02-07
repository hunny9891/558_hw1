// globals to be updated after file upload
var data = null;
var name = null;
var file = null;

// Hide the following HTML elements when page (HTML body) loads in browser. 
function initElements() {
    $ ("#loader").hide();
    $ ("#imageInfo").hide();
    $ ("#historyInfo").hide();
    $ ("input[type=file]").val('');
}


// **************** callback for DELETE buttons ****************
// fid: frontend id (id of the table row to delete)
// bid: backend id (probably shouldn't be leaking this in production code)))) )
function deleteQuery(fid, bid) {

    // remove the data on backend
    var json_data = {};
    json_data.id = bid;

    $.ajax({
        url:"http://127.0.0.1:8000/api/images",
        type: "DELETE",
        contentType: 'application/json',
        data: JSON.stringify(json_data),
    })

        .done(function (json_response) {
            $("#historyTable").find('tbody')  // remove data on frontend 
                .find("tr[id=" + fid + "]").remove();
        })
        .fail(function () {
            alert("server error");
        })
}

$(function() {

    // This callback function is called when a file is selected
    // the function is attached to the change event (e.g., when a file is uploaded), which triggers this function. 
    // that is, when you select a file from your local computer, the selection is change
    // which triggers this function
    $('input[type=file]').change(function () {

        file = this.files[0];               // first file selected
        var fileReader = new FileReader();  // create FileReader instance to read local file
        fileReader.onload = function() {
            data = fileReader.result;       // base64 encoded image
            name = file.name;               // save image filename
        }; 

        fileReader.onerror = function() {
            alert(fileReader.error);
        }; 

        fileReader.readAsDataURL(file)
    });


    // **************** callback for the OK button ****************
    $('a[id=sendToProxyBtn]').click(function () {
        
        if (data == null) {
            alert("Please upload a file first");
        } else {

            // form the json data object
            // the API expects the image to be base64 encoded
            var json_data = {};
            json_data.name = name;
            json_data.image = data;

            $.ajax({
                url:"http://127.0.0.1:8000/api/images",
                beforeSend: function(dummy) { $ ("#loader").show(); },
                complete: function(dummy) { $ ("#loader").hide(); },
                type: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify(json_data),
            })

                .done(function (json_response) {
                    $ ("#historyInfo").hide();  // valid response, hide history table 
                    console.log(json_response);

                    var prediction_tags = json_response.classification;
                    var prediction_desc = json_response.description;

                    // display the chosen image on the HTML page
                    // get the path of the image file
                    var path = (window.URL || window.webkitURL).createObjectURL(file);
                    $ ("#imgsrc").attr("src", path);
                    $ ("#imageInfo").show();

                    // map the values of the data parsed from JSON response message 
                    // to HTML elements within the HTML file dynamically. 
                    $("#imageDescription").text(prediction_desc);
                    $("#imageTags").text(prediction_tags);
                })
                .fail(function () {
                    $ ("loader").hide(); 
                    alert("server error");
                })
        }
    })

    // **************** callback for the history button ****************
    $('a[id=requestHistoryBtn]').click(function () {
        $ ("#historyInfo").hide();
        $("#historyTable tbody tr").remove();
        $ ("#imageInfo").hide();

        $.ajax({
            url:"http://127.0.0.1:8000/api/images",
            beforeSend: function(dummy) { $ ("#loader").show(); },
            complete: function(dummy) { $ ("#loader").hide(); },
            type: "GET",
        })
            .done(function (json_response) {
                $ ("#historyInfo").show(); // build the table with provided info
                for (const [index, element] of json_response.entries()) {

                    console.log(element)

                    // form the thumbnail
                    // source is expected to be the base64 encoded image provided by the database
                    var img = "<img src=" + element.image + " width=64 height=64></img>"
                    $("#historyTable").find('tbody')
                        .append($('<tr>')
                            .append($('<td>')
                                .append(img))
                            .append($('<td>')
                                .text(element.name))
                            .append($('<td>')
                                .text(element.classification))
                            .append($('<td>')
                                .text(element.description))
                            .append($('<td>')
                                .text(element.timestamp))
                            .append($('<td>')
                                .append("<button class=\"btn btn-danger\">DELETE</button>")
                                .attr('onClick', 'deleteQuery(' + index + ',' + element.id + ')'))
                        .attr('id', index)
                    );
                }
            })

            .fail(function () {
                alert("server error");
            })
    })
});