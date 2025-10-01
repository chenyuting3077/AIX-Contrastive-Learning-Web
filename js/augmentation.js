$(document).ready(function(){
    const IMAGES_PATH = [
        "./img/contrastive_learning/dog_1.jpg",
        "./img/contrastive_learning/dog_2.jpg",
        "./img/contrastive_learning/dog_3.jpg",
        "./img/contrastive_learning/cat_two.jpg",
        "./img/contrastive_learning/cat_2.jpg",
        "./img/contrastive_learning/cat_one.jpg"];
    let canvas = document.getElementById('augmented-image-output-canvas');
    let ctx = canvas.getContext("2d");
    // let COSINE_DEGREE;
    let canvas_t_SNE = document.getElementById('t-SNE');
    let canvas_cosine = document.getElementById('cosine-similarity-output-canvas');
    let canvas_epochs_t_SNE = document.getElementById("epoch-t-SNE");
    let canvas_batch_size_t_SNE = document.getElementById("batch-size-t-SNE");
    let canvas_supervised = document.getElementById("supervised-supervised-t-SNE");
    let canvas_unsupervised = document.getElementById("supervised-unsupervised-t-SNE");

    let ctx_t_SNE = canvas_t_SNE.getContext("2d");
    let ctx_cosine = canvas_cosine.getContext("2d");
    let ctx_epochs_t_SNE = canvas_epochs_t_SNE.getContext("2d");
    let ctx_batch_size_t_SNE = canvas_batch_size_t_SNE.getContext("2d");
    let ctx_supervised_t_SNE = canvas_supervised.getContext("2d");
    let ctx_unsupervised_t_SNE = canvas_unsupervised.getContext("2d");
    //concept
        // choose which image
        let batch_image_id = 0;
        $(".concept-parameter-dataset-images").click(function(e){
            let id = "#concept_batch_image_" + batch_image_id;
            let previous_id = "#concept_batch_image_" + (batch_image_id + 1) % 2;
            let previous_src = $(previous_id).attr("src");
            let now_src = $(this).attr("src")
            // not the same image
            if (previous_src != now_src){
                $(id).attr("src", now_src)

                $("#concept_augmented_image_"+ batch_image_id +"_0").attr("src", now_src);
                $("#concept_augmented_image_"+ batch_image_id +"_1").attr("src", now_src);
                // console.log("#concept_augmented_image_"+ id +"_0")
                batch_image_id = (batch_image_id + 1) % 2
            }
            //init
            change_image()
        })

        // choose which augmentation (including none)
        function change_image(){
            let img_root = "./img/contrastive_learning/augmented_img/"

            let batch_name_0 = $("#concept_batch_image_0").attr("src").split("/").pop().split(".")[0];
            let batch_name_1 = $("#concept_batch_image_1").attr("src").split("/").pop().split(".")[0];
            // console.log(batch_name_0,batch_name_1)

            let replace_img_list = [batch_name_0 + "_one",
                batch_name_0 + "_two",
                batch_name_1 + "_one",
                batch_name_1 + "_two"]
            // check there is a checkbox is checked
            // console.log(replace_img_list)
            // check which checkbox  is checked
            let is_rotate = $('#concept_rotate').is(":checked");
            let is_flip = $('#concept_flip').is(":checked");
            let is_crop = $('#concept_crop').is(":checked");
            let is_jitter = $('#concept_jitter').is(":checked");
            let is_blur = $('#concept_blur').is(":checked");

            function add_augmentation(augmentation){
                for (let i =0;i<replace_img_list.length;i++){
                    replace_img_list[i] = replace_img_list[i] + "_" +augmentation;
                }
            }

            // add augmentation
            if (is_rotate){
                add_augmentation("rotate");
            }
            if (is_flip){
                add_augmentation("flip");
            }
            if (is_crop){
                add_augmentation("crop");
            }
            if (is_jitter){
                add_augmentation("jitter");
            }
            if (is_blur){
                add_augmentation("gaussian");
            }

            //
            for (let i =0;i< 4;i++){
                replace_img_list[i] = img_root + replace_img_list[i] + ".jpg";
                // console.log(replace_img_list[i])
            }
            // change img
            $("#concept_augmented_image_0_0").attr("src", replace_img_list[0]);
            $("#concept_augmented_image_0_1").attr("src", replace_img_list[1]);
            $("#concept_augmented_image_1_0").attr("src", replace_img_list[2]);
            $("#concept_augmented_image_1_1").attr("src", replace_img_list[3]);
        }
        $(".concept-augmentation").change(function (e){
            change_image()
        })
        // choose augmented image
        let img_id = 0;
        $(".concept-augmented-images").click(function (e){
            let id = "#concept_pairs_image_" + img_id;
            let previous_id = "#concept_pairs_image_" + (img_id + 1) % 2;
            let previous_src = $(previous_id).attr("src");
            let now_src = $(this).attr("src")
            // not the same image
            if (previous_src != now_src){
                $(id).attr("src", now_src)
                img_id = (img_id + 1) % 2
            }

            // 確認是否兩個src都有
            let src_0 = $("#concept_pairs_image_0").attr("src");
            let src_1 = $("#concept_pairs_image_1").attr("src");
            // console.log(src_0,src_1)
            if (!src_0.includes("empty") && !src_1.includes("empty")){
                let class_0 = src_0.split("/").pop().split("_").slice(0,2);
                let class_1 = src_1.split("/").pop().split("_").slice(0,2);
                class_0 = class_0.toString()
                class_1 = class_1.toString()
                if( class_0 != class_1){
                    //negative
                    $("#contrastive_loss").attr("src", "./img/contrastive_learning/concept/negative_new.gif")
                    $("#pairs_text").text("Negative pairs")
                }
                else{
                    //Positive
                    $("#contrastive_loss").attr("src", "./img/contrastive_learning/concept/positive_new.gif")
                    $("#pairs_text").text("Positive pairs")
                }
            }
            else {
                // none
                $("#contrastive_loss").attr("src", "./img/contrastive_learning/concept/contrastive_loss.gif")
            }
        })

    //

    let img = new Image(canvas.width,canvas.height);

    $("#positive_pair").on("click",function (event){
        $("#pairs_output_gif").attr("src", "./img/contrastive_learning/positive_pairs_one.gif")
    });
    $("#negative_pair").on("click",function (event){
        $("#pairs_output_gif").attr("src", "./img/contrastive_learning/negative_pairs_one.gif")
    });

    function draw_rotation(ctx, img, degree, width, height){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        // save the unrotated context of the canvas so we can restore it later
        // the alternative is to untranslate & unrotate after drawing

        // move to the center of the canvas
        ctx.translate(canvas.width/2,canvas.height/2);

        // rotate the canvas to the specified degrees
        ctx.rotate(degree*Math.PI/180);

        // draw the image
        // since the context is rotated, the image will be rotated also
        // ctx.drawImage(img,-img.width/2,-img.width/2);
        return [-img.width/2,-img.height/2]
        // we’re done with the rotating so restore the unrotated context
        // ctx.restore();
    }
    function draw_flip(ctx, img, flipH, flipV) {
        let scaleH = flipH ? -1 : 1; // Set horizontal scale to -1 if flip horizontal
        let scaleV = flipV ? -1 : 1; // Set verical scale to -1 if flip vertical
        let posX = flipH ? canvas.width * -1 : 0; // Set x position to -100% if flip horizontal
        let posY = flipV ? canvas.height * -1 : 0; // Set y position to -100% if flip vertical
        ctx.scale(scaleH, scaleV); // Set scale to flip the image
        return [posX, posY]
    };
    function draw_color_jitter(ctx, img, brightness, contrast,saturate, hue){
        function normalize(x, mean){
            x = parseInt(x) + mean;
            x = x.toString();
            return x;
        }
        brightness = normalize(brightness,100);
        contrast = normalize(contrast,100);
        saturate = normalize(saturate,100);
        hue = hue / 100
        hue = hue.toString()
        ctx.filter = ctx.filter + "brightness("+brightness+"%) contrast("+contrast+"%) saturate("+saturate+"%) hue-rotate("+hue +"turn)";
    }
    function draw_gaussian_blur(ctx, img, kernel_size){
        ctx.filter = "blur("+kernel_size+"px)";
    }
    function draw_crop(ctx, img, size, width, height){
        let x = getRandomInt(width  - size);
        let y = getRandomInt(height - size);
        ctx.save()
        ctx.drawImage(
            img,
            x, y,
            size, size,
            0, 0, canvas.width, canvas.height);
        ctx.restore()
        return [x,y]
    }
    function getRandomInt(max, min=0) {
        let dis = max - min;
        return Math.floor(Math.random() * dis + min);
    }

    img.src = IMAGES_PATH[0];

    $(".augmented-image").click(function(event){
        let source = String($(this).attr("src"));
        img.src  = source;
        ctx.drawImage(img,0,0, canvas.width, canvas.height);
    });
    $("#augment-angle").on('input',function (e){
        draw_augmentation()
    })
    $(".augmented-flip").change(function (e){
        draw_augmentation()
    })
    $(".augmented-color-jitter").on('input',function (e){
        draw_augmentation();
    })
    $("#augmented-gaussian-blur").on('input', function (e){
        draw_augmentation()
    })

    function init(){
        $("#augment-angle").val(0)
        $("#augmented-brightness").val(0)
        $("#augmented-contrast").val(0)
        $("#augmented-saturate").val(0)
        $("#augmented-hue").val(0)
        $("#augmented-gaussian-blur").val(0)
        $("#augment-angle").val(0)
        $('#augmented-flip-vertical').prop('checked', false);
        $('#augmented-flip-horizontal').prop('checked', false);
    }
    $("#augmented-random-crop").click(function (e){
        // random integer from 0 to 3
        let size = getRandomInt(3,0);
        let image_name = img.src.split("/").pop().split(".")[0];
        let refine_image_name = image_name.split("_")[0] + "_" +image_name.split("_")[1];
        let new_path = "./img/contrastive_learning/concept/crop/"+refine_image_name+"_crop_"+size+".jpg"
        // 
        img.src = new_path;
        init()
    })

    $("#augmented-Reset").click(function (e){
        let image_name = img.src.split("/").pop().split(".")[0];
        let refine_image_name = image_name.split("_")[0] + "_" +image_name.split("_")[1];
        let image_path = "./img/contrastive_learning/"+ refine_image_name+".jpg"
        img.src = image_path;
        init()
    })
    let augmentation_img = new Image()
    function draw_augmentation(){
        let degree = $("#augment-angle").val()
        let flip_h = $('#augmented-flip-horizontal').is(":checked");
        let flip_v = $('#augmented-flip-vertical').is(":checked");
        let brightness = $("#augmented-brightness").val();
        let contrast = $("#augmented-contrast").val();
        let saturate = $("#augmented-saturate").val();
        let hue = $("#augmented-hue").val();
        let random_blur_kernel  = $("#augmented-gaussian-blur").val();
        let x_y;
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        draw_gaussian_blur(ctx, img, random_blur_kernel);
        draw_color_jitter(ctx, img, brightness, contrast, saturate, hue);
        x_y = draw_rotation(ctx, img, degree);
        draw_flip(ctx, img, flip_h, flip_v);
        ctx.drawImage(img,x_y[0],x_y[1], canvas.width, canvas.height);
        ctx.restore();
    }
    img.onload = function (){
        // console.log("img onload")
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
    }

    // ================== plot t-SNE ==========================//
    const tSNE_COLOR_CIFAR10 = ["Blue", "red", "Aquamarine", "brown", "Lavender", "green", "purple","orange","black","Tan"];
    const TEMPERATURE_LIST = [0.1, 0.5, 1];
    const PROJECTION_HEAD_NUMBERS = [32,64,128,256,512,1024,2048];
    const BATCH_SIZE_NUMBERS = [128,256,512];
    let tSNE_setting = {
        type: 'scatter',
        options: {
            responsive: false,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                }
            },
            scales: {
                y: {
                    display: false
                },
                x: {
                    display: false
                },
            },
            animations: {
                x: { duration: 0 },
                y: { duration: 0, easing: 'easeOutBack' },
            },
        }

    }
    const tSNE_chart =new Chart(ctx_t_SNE, tSNE_setting);
    const epochs_tSNE_chart =new Chart(ctx_epochs_t_SNE, tSNE_setting);
    const batch_size_tSNE_chart =new Chart(ctx_batch_size_t_SNE,tSNE_setting);
    const supervised_tSNE_chart = new Chart(ctx_supervised_t_SNE,tSNE_setting);
    const unsupervised_tSNE_chart = new Chart(ctx_unsupervised_t_SNE, tSNE_setting);

    function change_batch_size_tSNE_chart(input_json){
        // console.log("hi")
        let datasets = [];
        let keys = Object.keys(input_json);
        keys = keys.sort();
        for(let i=0; i < keys.length;i++){
            datasets.push({
                label:keys[i],
                data: input_json[keys[i]],
                backgroundColor: tSNE_COLOR_CIFAR10[i],
            })
        }
        const data = {
            datasets: datasets,
        };
        batch_size_tSNE_chart.data = data;
        batch_size_tSNE_chart.update();
        // console.log(batch_size_128)
    }
    function change_epochs_tSNE_chart(input_json){
        let datasets = [];
        let keys = Object.keys(input_json);
        keys = keys.sort();
        for(let i=0; i < keys.length;i++){
            datasets.push({
                label:keys[i],
                data: input_json[keys[i]],
                backgroundColor: tSNE_COLOR_CIFAR10[i],
            })
        }
        const data = {
            datasets: datasets,
        };
        epochs_tSNE_chart.data = data;
        epochs_tSNE_chart.update();
    }
    function change_tSNE_chart(input_json){
        let datasets = [];
        let keys = Object.keys(input_json);
        keys = keys.sort();
        for(let i=0; i < keys.length;i++){
            datasets.push({
                label:keys[i],
                data: input_json[keys[i]],
                backgroundColor: tSNE_COLOR_CIFAR10[i],
            })
        }
        const data = {
            datasets: datasets,
        };
        tSNE_chart.data = data;
        tSNE_chart.update();
    }
    function change_supervised_chart(input_json){

        let datasets = [];
        let keys = Object.keys(input_json);
        keys = keys.sort();
        for(let i=0; i < keys.length;i++){
            datasets.push({
                label:keys[i],
                data: input_json[keys[i]],
                backgroundColor: tSNE_COLOR_CIFAR10[i],
            })
        }
        const data = {
            datasets: datasets,
        };

        supervised_tSNE_chart.data = data;
        supervised_tSNE_chart.update();
    }
    function change_unsupervised_chart(input_json){
        let datasets = [];
        let keys = Object.keys(input_json);
        keys = keys.sort();
        for(let i=0; i < keys.length;i++){
            datasets.push({
                label:keys[i],
                data: input_json[keys[i]],
                backgroundColor: tSNE_COLOR_CIFAR10[i],
            })
        }
        const data = {
            datasets: datasets,
        };
        unsupervised_tSNE_chart.data = data;
        unsupervised_tSNE_chart.update();
    }
    /*==========================================================================*/

    /*==========================================================================*/
    change_tSNE_chart(temperature_tSNE_0_1)
    change_epochs_tSNE_chart(epochs_100)
    change_batch_size_tSNE_chart(batch_size_128)
    
    change_temperature_accuracy(temperature_acc_0_1)
    change_batch_size_accuracy("#accuracy-batch-size-", batch_size_acc_128)
    change_epoch_accuracy( epochs_100_acc)

    change_supervised_chart(supervised_simclr_100)
    change_unsupervised_chart(unsupervised_simclr_100)

    function change_temperature_accuracy(input_json){
        let base_name = "#accuracy-temperature-"
        let keys = Object.keys(input_json);
        keys = keys.sort();
        for(let i=0; i < keys.length;i++){
            let id = base_name + keys[i]
            $(id).text(input_json[keys[i]])
        }
    }


    function change_batch_size_accuracy(base_name, input_json){
        // let base_name = "#accuracy-batch-size-"
        let keys = Object.keys(input_json);
        keys = keys.sort();
        
        for(let i=0; i < keys.length;i++){
            let id = base_name + keys[i]
            $(id).text(input_json[keys[i]])
        }
    }
    function change_epoch_accuracy(input_json){
        let base_name = "#accuracy-epoch-"
        let keys = Object.keys(input_json);
        keys = keys.sort();
        for(let i=0; i < keys.length;i++){
            let id = base_name + keys[i]
            $(id).text(input_json[keys[i]])
        }
}


    $("#temper-parameter").on('input',function (e){
        /***
         * 當 temperature parameter 被調整時 *
         * rewrite loss chart
         * rewrite accuracy chart
         * rewrite tSNE chart
         ***/
        let temperature = TEMPERATURE_LIST[this.value].toString();
        temperature = temperature.replace(".", "_")

        change_tSNE_chart(eval("temperature_tSNE_" + temperature));
        change_batch_size_accuracy("#accuracy-temperature-", eval("temperature_acc_" + temperature))

        // change temperature
        $("#temper-parameter-text").text(TEMPERATURE_LIST[this.value]);
    })
    $("#epoch-parameter").on('input',function (e){
        /***
         * 當 epoch-parameter 被調整時 *
         * rewrite loss chart
         * rewrite accuracy chart
         * rewrite tSNE chart
         ***/
        change_epochs_tSNE_chart(eval("epochs_" + this.value));
        change_epoch_accuracy(eval("epochs_" + this.value +"_acc"));
        $("#epoch-parameter-text").text(this.value);
    })
    $("#supervised-parameter").on('input',function (e){
        /***
         * 當 epoch-parameter 被調整時 *
         * rewrite loss chart
         * rewrite accuracy chart
         * rewrite tSNE chart
         ***/
        // const JSON_DIR = "./ablation";
        // let json_path_tSNE,unsupervised_path;
        // json_path_tSNE = JSON_DIR + "/supervised/supervised_simclr_" + this.value + ".json";
        // unsupervised_path = JSON_DIR + "/supervised/unsupervised_simclr_" + this.value + ".json";
        // json_path_acc = JSON_DIR + "/epochs/epochs_" + this.value + "_acc.json";
        change_supervised_chart(eval("supervised_simclr_" + this.value ));
        change_unsupervised_chart(eval("unsupervised_simclr_" + this.value ));
        // change_epoch_accuracy(json_path_acc);
        $("#supervised-parameter-text").text(this.value);
    })
    $("#batch-size-parameter").on('input',function (e){
        /***
         * 當 epoch-parameter 被調整時 *
         * rewrite loss chart
         * rewrite accuracy chart
         * rewrite tSNE chart
         ***/
        let batch_size = BATCH_SIZE_NUMBERS[this.value];
        
        change_batch_size_tSNE_chart(eval("batch_size_" + batch_size));
        change_batch_size_accuracy("#accuracy-batch-size-", eval("batch_size_acc_" + batch_size))
        $("#batch-size-parameter-text").text(batch_size);
    })
    /*** ======================================================= overview ===========================================================***/
    $("#overview-parameter-temperature-parameter").on('input ready',function (e) {
        // console.log("ready");
        /*** =======================================================
         * slide range slide of temperature parameter
         ===========================================================***/
        $("#overview-parameter-projection-temperature-parameter-text").text(TEMPERATURE_LIST[this.value]);




    })
    $("#overview-parameter-projection-head-numbers").on('input ready',function (e) {
        /*** =======================================================
         * slide range slide of temperature parameter
         ===========================================================***/
        $("#overview-parameter-projection-head-numbers-text").text(PROJECTION_HEAD_NUMBERS[this.value]);

    })
    $("#overview-parameter-batch-size").on('input',function (e) {
        /*** =======================================================
         * slide range slide of temperature parameter
         ===========================================================***/
        $("#overview-parameter-batch-size-text").text(BATCH_SIZE_NUMBERS[this.value]);
    })
    /***=========================================================cosine==================================================================***/
    init_cosine_ctx();


    function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
        fromy = canvas_cosine.height - fromy ;
        toy = canvas_cosine.height - toy;
        let headlen = 10;
        let angle = Math.atan2(toy-fromy,tox-fromx);

        ctx.save();
        ctx.strokeStyle = color;

        //starting path of the arrow from the start square to the end square
        //and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineWidth = arrowWidth;
        ctx.stroke();

        //starting a new path from the head of the arrow to one of the sides of
        //the point
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
            toy-headlen*Math.sin(angle-Math.PI/7));

        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
            toy-headlen*Math.sin(angle+Math.PI/7));

        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
            toy-headlen*Math.sin(angle-Math.PI/7));

        //draws the paths created above
        ctx.stroke();
        ctx.restore();
    }
    function draw_vector(angle, length){
        let x = length * Math.cos(angle * Math.PI/180) - 10;
        let y = length * Math.sin(angle * Math.PI/180) - 10;
        // console.log(x, y);
        drawArrow(ctx_cosine, 10, 10, x, y, 3, 'black');
    }
    //畫 x, y 軸
    let counterClockwise = true;
    function init_cosine_ctx(){
        ctx_cosine.clearRect(0,0,canvas_cosine.width, canvas_cosine.height);
        drawArrow(ctx_cosine, 9, 10, canvas_cosine.width-10, 10, 3, 'black');
        drawArrow(ctx_cosine, 10, 9, 10, canvas_cosine.height-10, 3, 'black');

    }
    function draw_two_vector(degree_1, degree_2, img_1, img_2){
        init_cosine_ctx();
        // if (degree_1 > degree_2){
        //     let tmp = degree_1
        //     degree_1 = degree_2
        //     degree_2 =
        // }

        let theta_1 = (2 * Math.PI - ((degree_1-3) * Math.PI)/180);
        let theta_2 = (2 * Math.PI - (degree_2 * Math.PI)/180);
        // console.log(degree_1, degree_2, theta_1,theta_2)
        // 畫弧線
        ctx_cosine.beginPath();
        ctx_cosine.arc(10, canvas_cosine.height-10, 100, theta_1, theta_2, counterClockwise);
        ctx_cosine.lineWidth = 5;


        // stroke the text
        ctx_cosine.strokeStyle = 'red';
        ctx_cosine.stroke();
        ctx_cosine.restore();
        ctx_cosine.font = "30px Arial";

        function draw_image(image, angle, length, size){
            let image_x = length * Math.cos(angle * Math.PI/180) ;
            let image_y = length * Math.sin(angle * Math.PI/180) + size/2;
            image_y = canvas_cosine.height - image_y;
            ctx_cosine.drawImage(image, image_x, image_y, size, size);
            // console.log("image coordinate: ",image_x, image_y)
        }

        draw_image(img_1, degree_1, 250, 50);
        draw_image(img_2, degree_2, 250, 50);

        draw_vector(degree_1,250);
        draw_vector(degree_2,250);

    }
    let cosine_id = 0;
    $(".cosine-similarity-model-dataset").click(function (e){

        const Image_COSINE_LIST = [
            "cat1_one",
            "cat1_two",
            "cat2_one",
            "cat2_two",
            "plane1_one",
            "plane1_two",
            "plane2_one",
            "plane2_two",
        ]


        function find_id_index(id){
            let id_index;
            for(let i=0; i < Image_COSINE_LIST.length ;i++){
                if(id == Image_COSINE_LIST[i]){
                    id_index = i;
                    break
                }
            }
            return id_index;
        }

        let id = "#pair_" + cosine_id;
        let previous_id = "#pair_" + (cosine_id + 1) % 2;
        let previous_src = $(previous_id).attr("src");
        let now_src = $(this).attr("src")
        // not the same image
        if (previous_src != now_src){
            $(id).attr("src", now_src)
            cosine_id = (cosine_id + 1) % 2
        }

        // // 確認是否兩個src都有
        let src_0 = $("#pair_0").attr("src");
        let src_1 = $("#pair_1").attr("src");

        if (src_0 != undefined && src_1 != undefined){

            let class_0 = src_0.split("/").pop().split("_")[0];
            let class_1 = src_1.split("/").pop().split("_")[0];

            // change text
            if( class_0 != class_1){
                //negative
                $("#cosine-positive-negative > b").text("Negative pair");
                $("#high-low-similarity > b").text("Low similarity");
            }
            else{
                //positive
                // console.log("positive")
                $("#cosine-positive-negative > b").text("Positive pair");
                $("#high-low-similarity > b").text("High similarity");
            }


            // draw angle
            let first_index = find_id_index( src_0.split("/").pop().split(".")[0]);
            let second_index = find_id_index(src_1.split("/").pop().split(".")[0]);
            // console.log(first_index, second_index)
            let diff_theta = parseInt(COSINE_DEGREE[first_index][second_index])
            let degree_1 = 15;
            let degree_2 = degree_1 + diff_theta
            //
            let img_1 = new Image(canvas_cosine.width,canvas_cosine.height);
            let img_2 = new Image(canvas_cosine.width,canvas_cosine.height);
            //
            img_1.src = src_0
            img_2.src = src_1
            //
            draw_two_vector(degree_1, degree_2, img_1, img_2)
        }
    })
    $(".loss-model-dataset").click(function (e){

        const Image_COSINE_LIST = [
            "cat1_one",
            "cat1_two",
            "cat2_one",
            "cat2_two",
            "plane1_one",
            "plane1_two",
            "plane2_one",
            "plane2_two",
        ]


        function find_id_index(id){
            let id_index;
            for(let i=0; i < Image_COSINE_LIST.length ;i++){
                if(id == Image_COSINE_LIST[i]){
                    id_index = i;
                    break
                }
            }
            return id_index;
        }

        let id = "#loss_pair_" + cosine_id;
        let previous_id = "#pair_" + (cosine_id + 1) % 2;
        let previous_src = $(previous_id).attr("src");
        let now_src = $(this).attr("src")
        // not the same image
        if (previous_src != now_src){
            $(id).attr("src", now_src)
            cosine_id = (cosine_id + 1) % 2
        }

        // // 確認是否兩個src都有
        let src_0 = $("#loss_pair_0").attr("src");
        let src_1 = $("#loss_pair_1").attr("src");
        // console.log(src_0)
        if (src_0 != undefined && src_1 != undefined){

            let class_0 = src_0.split("/").pop().split("_")[0];
            let class_1 = src_1.split("/").pop().split("_")[0];

            // $("#loss-total-arrow").css("animation", "");
            // $("#loss-total-arrow").css("animation", "twinkle 2s infinite alternate");
            // change text
            if( class_0 != class_1){
                //negative
                $("#loss-positive-negative > b").text("Negative pair");
                // $("#loss-negative-arrow").css("animation", "twinkle 2s infinite alternate");
                // $("#loss-positive-arrow").css("animation", "");

                // $("#loss-total-arrow").css("animation", "none");
                // $("#loss-total-arrow").css("animation", "twinkle 2s infinite alternate");
                $("#loss-negative-arrow").css("opacity", 100)
                $("#loss-positive-arrow").css("opacity", 0)


                $("#loss-total-arrow").css("opacity", 100)
                $("#loss-total-arrow > p").html('&#8593');
                $("#loss-total-arrow > p").css("color", "red");
                $("#loss-total-arrow > span").css("color", "red");

            }
            else{
                //positive
                $("#loss-positive-negative > b").text("Positive pair");
                // $("#loss-positive-arrow").css("animation", "twinkle 2s infinite alternate");
                // $("#loss-negative-arrow").css("animation", "");
                $("#loss-positive-arrow").css("opacity", 100)
                $("#loss-negative-arrow").css("opacity", 0)

                // $("#loss-total-arrow").css("animation", "none");
                // $("#loss-total-arrow").css("animation", "twinkle 2s infinite alternate");

                $("#loss-total-arrow").css("opacity", 100)
                $("#loss-total-arrow > p").html('&#8595');
                $("#loss-total-arrow > p").css("color", "green");
                $("#loss-total-arrow > span").css("color", "green");
            }
        }
    })
});