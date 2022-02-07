// globals to be updated after file upload
var data = null;
var name = null;
var file = null;

// Hide the following HTML elements when page (HTML body) loads in browser. 
function initElements() {
    console.log("init not-secure");
    $ ("#loader").hide();
    $ ("#imageInfo").hide();
    $ ("#historyInfo").hide();
    $ ("input[type=file]").val('');
}


function encodedImgBase64() { 

    return "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAPdUlEQVR4nO2aW4xd11nHf9/al3PmzM0+c4ntOI7juMWdXJu6g5GiXJRLbUAKKoKKh0ZCCKQ8QKkQKqjwwENVFQSl4qEEEKIBqaKVItqXRCpFcVqiZhq5LU1dx3Yde8Ye2zP2eHzmXPbZl/XxsPaeOfYc2+eMbZDAf83o3PZa31r//d3Xhju4gzu4gzv4/wvp9uXIk9NVYKSH8TGwUDs4k/YjdOTJaYBJoNLPuFslvxP+Nb5/EXgBuN7EBjgK/CVwvE+5Q8DvAM/cQMb1cDPyV3EtAh4CnuphfK+a0k3uh3uUcTvkX7GQddAkjVeNQ0FV3Zt1F5JqlsX9Ck3OX4i8TSPpmgFK/tdhkV2N8+plaKqZ7Vt+J3yAkSendwKPq2rZeIbK3oemvEoFVDGDA/iTY0jgXylcQNvxePMnxz5hgmBaAt8Hflg7ODPTTdDIk9N7gMc1s7Z0z9ah4Sc+ussMD7lttCKyWh1VCwjaitCku2VIOUTC0I2Lk/HoxOwnxPenre+ZqbTORHweixAGhupISDk04Mzl8N9+c/a7XQkAHgO+BFRBKO24m/C+eyDL8KubKO+6B0rBlQsRIVlY2tk+Nf8nHXfrz4GuBACPA3+PAL5H5cNTlD94H2oVrTeIF5bQLAMBW2tgo3aXKRRvaBAZGACB9NLlnfG5xVX5XXS0E38HXJMAcCytChLVXPWdCZhrzq6otWAtKPb6a+hYpbhVC2ARpPhBFRHpbgH5Je7aYoyCVTAKqqvT34CMVaz3ASKI7zuVN+L+bYam2drCRd2rWrxKhdJ9OxDPQGbL7e13lcv33xvms9VrB2cKUiJgiYLoJK1olISoYuMYmyRo6kzAxgk2SVjnCFSRNAPV/B9MGOKNbUI8j7AplOuLqBg8I6gqmb0+FesIUGMItm+htHsnWIsmCfG5C5C5fUgpwATOHNRahp/ex/BTP48YoXV8dn/0s1Nb8nnPAS8D7+ZTfxf4bQCbJEP17//4pea7x/YB2LiNrTWdD1BF4wSN0/X7zyyVqd1wzxannVlG5YEPUL7/XjJjuPfsLLuOnMN6PklimVuMOHMxwsi1PGoXAsQT/JFh/OooWEtWqxOfPo9ttRzjI4OYgbJzkJUy4T1bMaUQ8QzJUm0Pwp58qlngGwUBtYMzJ4GTAJWHPliJT83/ErDPCe0WAdYvWtOUYMsY/kQVtc5w/PEqAKkxDNs6m8/4WC+gHWecOGt5f76JZ/ogAEDRNTVD1xYkzvmJFFZIfp1FVZzGxClWDECK7R6i/Oqm8FqyrwtVVAzqmXyddKwT54ey1K0ss4hajCjX2X8vixAkDBDNTVkt2o5BlQwwjRYaJ2AM3tAAE7/164hn0MxW2rPzz2CkasLQB07UDs4cyieNge/k72/sOFcv1HR0pf5oZXZ+D6pkpZBovEo6UMKIcHl0Mwu7nkE9j3YUs7LyPsnSHJnJ/fvcif4JEM9gBgcwge9CVKNN2mg4bYjazjEFPqjiT1Sp/srzAGT1+uTSN7/9+yImBULgH4CCgCYuLP1TPwQ0ml687XtvfV4MeySzJFMPsPTsk+jQIB5w9K6tnKoMo2LImi0uXlSWzzeQggA2QIDz+oLmqu9SQ+v0T02udtbZpDFIkS/EgTEwomhhzUPFlLWDMwUJzV43X8DbW40AyFLk/g+4NRmDqNLyPOqejxgh83yaxpA5u73mfJ0ErN4JyQ1cpTAvN4HzCLJGzOqXeb6Q+wk3h6IidDiznu/09aDG3U5RA6ZYRu6f1K1OFIzk+UTgg2eumRgUBBwCPgWUySzNnxz9ZPv0uSewFq86SnnXDszmERAhK9VIvFwbVNF2G41ARSgfPspgbQVEsGl2QZYuvXJB9cfGmcDhjWz4wPTEHuCTwKRVTUcHg32hb0AD2gvzNN46RH2wgrEWOzEOW8adWYYlhvY9wuDeh8AI6eLS48DLmqZGROrAP9cOzhzy4coQBZDVmx9BeEKTlLFf+0UGHvgAXpG3JwkmartIkKZkURtNUtQY/KPvM/CVv0GDENDacJZ+4wfvtt7cyMY7sB1Xnm8H8D1hqOKBepjLx/G+fghdamOTFPnU76HbJtDUYgIff3yrqxuMIYIphKl8zjrwn8Chrj7AlFy1YcUgnufudqcd5Smnsw5ngxiDeh42CHMCwAYloHVTu1fVGBc11quxGAgCKClicl8gefYq4lJkW0SvKwan5CZ5LSf4Y+ANQdMsSarJ2YU96XKtgiqCYIYqTkCjhV5eQetN1Bg21S5z18QA6vmoarkd2+mP7R3HGAmB06/NLB7pZdO52m9X1TgMzLTvSbn4LbPKSstVinGiNVUOA3VUbRbFO7OFix/EWowf4Puey7uNQdO0s+JYxbUIeAX4N02ztH3s1BMXzy5+HpEdmqZsfuE5Ko98CFSxixfJ3vsZMvMj8Hy2DKxw/45hLEKa2vGT51qfxtUAYT7nZ3shAGfzLwKx70l502AwbjzBCJy/FDM/H7ngBCfjxH4O5Yd+PbXLx97/3fTUmT/CKv74KEMffRR/bJPzSY3W1VpwbQJqB2eWcIULEvjzICmAbcds+uVnnGe1FvEM0oxg5jvg+fgfGadUHS60LhSRbR3TTva4+eLa7cUH4wm+J67+Qrm0kpAng7HC7NHTzdMAw+cWLwKram/TBLUZLoHR3gnohPi+D5QBJPMQI4jvoTa3fQE8DzwfEeMKD+PST1WwquRJZM+9v8xqCmtZbuGCTB5lJU/JgbJ07KFIeBTcxeT/N5cKcxT4M2AT1sbRibkXskbrKVCk1T4tzfarojqnqna5nj733mx9vyqIEUaHfMZHhgFoxnbfgemJL6ir9xvAq6/NLL4LcGB64kHg46o6KCLcu2VgXyV05DbblgvLbeLMxfhGlL2O8i3WKs7TvRK7IQJqB2dmcWmrg8gEIk/ln86lWfZydD49XNxgEdlvVdkxWeYXHtxMdSgAgYVL8aPAo/m4JnCEtVJ5CvgMeZt8uOIxuTkEhaV6wntzdebOt5ynV7517Ezzr25m053ouyIz5VLnGD+EcpR/CHzjgzNB4wzWVY1rzZ48cdQIZbVSzENdBFQ6WzqavwpgjGBcWdfbmovBqEtpr4H+S1KYw925NH+td/x2Lv8uUiWM4mznSktGAJJUGRsJyIttP8109/N7xx80AqHv7TZGfXC23Y4ttTzURXFWU+UkLhco5zJujNxXie87p+EZutUEGyHgVeCt/H0d1/go8DrwrkLaTuyOI6canzWGfVZh21iJ3fe4gyBrtTJ/IXrpcj39BEAQUh0dCCsYpy1nL0Ycn89cv9ByuJ3Yz6mT49OLzStI4GEGK5iRQUAwgwO3hoDawZl5YL7bb0dmGwvAAoCqLi1ejusAWaZMbipRKRtEhcyqL8guYBe4wibwxUUYoB5lHJ1rFCpfV9UfHj/T6s/ZGeM0wHMaIJ6HdqmINqIBPcH3jI9LgFwog9XeXBHGVnubxQU5RJy9562sEGRD3aMrukVdcgC4jQQAy8BXgBnQuNnOHjt5rrW/6GK3k4y7qiHDgz5ZpjRaFi3ukeV1lEM4An+az9UHFAkDvE0jq5mgtzDiaoercNsIODLbWAb+sfhslReNsF8VBsseUzuH2TpWYmI0oB5lnFuqE7Vt0SD96rEzzVc2LFzBlEs5AZtBBH90GPF6rwVuOTwjftG7yG17Xd91zUfpRte1douv2ulV9m+Ka28bAQemJ3xgHJeuxu0km1SBOFGXIluIU0sUK3Fi8YwQBAYBVHXyY3vHt+VVZARceG1msZdUehnnoCNUfW1F49lKvQKCtuMalgu4jS+Rh+/bqQHjwKeB6cxqvHNrZfvk5hIrjYSLKym1RsLS6ZhKuc1AIAxV/NUjsZUo+2SSJk/jfMAM8EV6i/+vAydA06ze3Hb5jbf/wAuCxwBsK3oTm30xvy4l71DdTgLKwDT5MwChb6gOB4hAO1EuXG5z8mwTVbhvW4X7tgTO6ys0onQKVrs3xVw3RJ62zwJokm6Pjhz/zdUeJnq6/tYP/uPqMbeNAGs1FnHpbhGBVm08D4MmL+pNfufz7DkfD+Jy6Nh2pM29wgyUfcDviK5ht+tuKQEHpiceBvapahr4Mlkq+dtNvqUosZxZbFFrZSyvpHGa6pvkj7akqe5eWkmeMIYQFQYHfMZG3HpTq9uXavGL+z86viAiPvC912YW/6uH5dRwR3PFYcC3u110qzXgeeAvwN3h4bJHKXBl7VIt4fvvLZNlAFoHvnz0dPNVAM+Tj59dih4Dqp4nPPvhMe6eGEBVqTXTqeV68vkOGX8I3JCAvKnz1ze67pYSoB3Z1lrTNFd9UbJMse64+oqMpPO71T5GZ9haTeh6PfXvHTdFwIHpCYOr4U0U27gUmEph553n83lRE+NCjxGRZTo6RCKSAss5gVZVhpLMhoojx/eEcqkIkVSefnSsXA5NiOvsNl+bWdzwocvNasAO4CVgd+BLvGWsNDU2EqCw7nw+t/kv5+NS4J2Oed7BHcz4qjC32HppYbn9rKpSKXncPVkm8JyjvFhLfrUVtz6Ec2rH8zlPbnQDN0tAFdgPPAwu1G0eCVCl2/n88cLmr8aR2cY88M3ic5zqcwLPZlZ5ZPcwO7cOUA49RGClmT1cyMP5gn/lf4uAzGosFKHO2Wd+fOreyxWdnK5hqOuiPAmLybr1clS1aPzGSv8h8gpZ/Q7IG5hT1mo8OuTvHq541eLpDgXOL7n1JJmtp5m+g+sPhMDbfYh5G6iixKpM1hrp3lbb5qfLyr13DeTvtLrSzPZ/bO/47jxtPlw0WnvFRjTg48BnECLfE3/beLlSKTn1nDsf8caPLjoHCBes5YtJav/dC72Q/u7UvwBfq7WSOE702WNzzS+JMGRV2bVtkPu3l0Gh2c52/OxM808RUly2+AXWGq09oW8CVBnEef5K0az0TH5oIXCxluB7As5D106ei/p+DuDIbGN1TGa1lll3smCti5UuwoBxFWbno7KD/e6nfw0onpXJnyEQBC3O4qV4sm7Vctd3IPoVJx1dDFH0Kr9wVWbQdzjsm4CJ0dKacIETZ5vF+QvNdva6Vb6Ks/karvd/szgC/DEwghJfrqe/EbXtfnDldDPKrnfwc0P0TcDggAfkG44zjs01OH+pXTw+c+jEfGvjnZwueG1mcR74WvH5+b3jPycu9Lp1rB2TbQgbcYI+rKmeMeB5eWWH9BzqNgrPXFdG3/vZCAE/Bd5kvVcvGpi3G7dU/kYPRq5sLKw+Ndlv93ZDWC9/Df8T8u/gDu7gDu7g/wz+G2NDCHkukjZ3AAAAAElFTkSuQmCC";

}

$(function() {

    // This callback function is called when a file is selected
    // the function is attached to the change event (e.g., when a file is uploaded), which triggers this function. 
    // that is, when you select a file from your local computer, the selection is change
    // which triggers this function
    $('input[type=file]').change(function () {
       //$("#resultsInfo tr").remove();
       //$("#tag_info tr").remove();

        file = this.files[0];           // first file selected
        var fileReader = new FileReader();  // create FileReader instance to read local file
        fileReader.onload = function() {
            data = fileReader.result;
            name = file.name;
            type = file.type;
        }; 

        fileReader.onerror = function() {
            alert(fileReader.error);
        }; 

        fileReader.readAsDataURL(file)
        //fileReader.readAsArrayBuffer(file);
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
            console.log(data);

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