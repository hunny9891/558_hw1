// globals to be updated after file upload
var data = null;
var name = null;
var type = null;

// Hide the following HTML elements when page (HTML body) loads in browser. 
function initElements() {
    console.log("init not-secure");
    $ ("#loader").hide();
    $ ("#imageInfo").hide();
    $ ("#historyInfo").hide();
    $ ("input[type=file]").val('');
}

$(function() {

    // This callback function is called when a file is selected
    // the function is attached to the change event (e.g., when a file is uploaded), which triggers this function. 
    // that is, when you select a file from your local computer, the selection is change
    // which triggers this function
    $('input[type=file]').change(function () {
       //$("#resultsInfo tr").remove();
       //$("#tag_info tr").remove();

        var file = this.files[0];           // first file selected
        var fileReader = new FileReader();  // create FileReader instance to read local file
        fileReader.onload = function(event) {
            data = file;
            name = file.name;
            type = file.type;
        }; 

        fileReader.onerror = function() {
            alert(fileReader.error);
        }; 

        fileReader.readAsArrayBuffer(file);
    });


    // **************** callback for the OK button ****************
    $('a[id=sendToProxyBtn]').click(function () {
        
        if (data == null) {
            alert("Please upload a file first");
        } else {
            var form = new FormData();
            form.append("image", data, name);
            form.append("name", name);

            $.ajax({
                url:"http://127.0.0.1:8000/api/images",
                beforeSend: function(dummy) { $ ("#loader").show(); },
                complete: function(dummy) { $ ("#loader").hide(); },
                type: "POST",
                timeout: 0,
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                data: form,

            })

                .done(function (json_response) {
                    $ ("#historyInfo").hide();  // valid response, hide history table 

                    var obj = JSON.parse(json_response);
                    var prediction_tags = obj.classification;
                    var prediction_desc = obj.description;

                    // display the chosen image on the HTML page
                    // get the path of the image file
                    var path = (window.URL || window.webkitURL).createObjectURL(data);
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
                    
                    //console.log(element)

                    img_base64_val = btoa(unescape(encodeURIComponent(element.image)))

                    //var src = (window.URL || window.webkitURL).createObjectURL(element.image);
                    //var img = "<img src=" + src + "/>"

                    //var src = "data:image/png;base64," + btoa(element.image);
                    //var b = new Blob(element.image, {type: 'multipart/form-data'});
                    //var img = "<img src=data:image/png;base64," + b + "/>";
                    //var img = "<img src=data:image/png;base64," + btoa(element.image) + "/>";
                    if (index==0) {
                        console.log(element.image);
                        console.log("");
                        console.log(data);
                    }

                    var img = "<img src=data:image/jpeg;base64," + element.image + "/>"

                    $("#historyTable").find('tbody')
                        .append($('<tr>')
                            .append($('<td>' + img + '</td>'))
                            .append($('<td>')
                                .text(element.name))
                            .append($('<td>')
                                .text(element.classification))
                            .append($('<td>')
                                .text(element.description))
                            .append($('<td>')
                                .text(element.timestamp))
                        );
                }
            })

            .fail(function () {
                alert("server error");
            })
    })
});