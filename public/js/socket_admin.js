$('#cur_race_info_save').click(function(){
    var tabledata = [];
    var name = [];
    var sp = [];
    var color = [];
    $('#cur_race_info_table').find(".info_name").each(function( index ) {
        name.push($( this ).val());
    });
    $('#cur_race_info_table').find(".info_sp").each(function( index ) {
        sp.push($( this ).val());
    });
    $('#cur_race_info_table').find(".info_color").each(function( index ) {
        color.push($( this ).val());
    });
    for (let i=0; i<name.length; i++)
        tabledata.push({name:name[i], sp:sp[i], color:color[i]});
    Client.socket.emit('cur_race_save', {tabledata: tabledata, time:$('#cur_race_time').val(), name:$('#cur_race_name').val()});
});

Client.socket.on('cur_race_save', function(data){
    if(data.result){
        $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Update Succeed');
        $('#cur_race_time').val(data.cur_race_time);
        $('#cur_race_name').val(data.cur_race_name);
        $('#cur_race_info_table').html('');
        for (var i=0; i<data.dataArray.length; i++) { 
            $('#cur_race_info_table').append("<tr>"+
                "<td class='border px-4 py-2 row_num'>"+
                    (i+1 )+
                "</td>"+
                "<td class='border px-4 py-2'>"+
                    "<input class='info_name' name='name' type='text' value='" + data.dataArray[i].name + "' placeholder='Name'/>"+
                "</td>"+
                "<td class='border px-4 py-2'>"+
                    "<input class='info_sp' name='sp' type='text' value='" + data.dataArray[i].sp +  "' placeholder='SP'/>"+
                "</td>"+
                "<td class='border px-4 py-2'>"+
                    "<select class='info_color'>"+
                        "<option class = 'Color_None' value='Color_None' " + (data.dataArray[i].color == 'Color_None' ? 'selected' : '') + ">None</option>"+
                        "<option class = 'Color_Blue' value='Color_Blue' " + (data.dataArray[i].color == 'Color_Blue' ? 'selected' : '')  + ">Blue</option>"+
                        "<option class = 'Color_Red' value='Color_Red' " + (data.dataArray[i].color == 'Color_Red' ? 'selected' : '')  + ">Red</option>"+
                      "</select>"+
                "</td>"+
                "<td class='border px-4 py-2'>"+
                    "<button type='button' class='Cur-Race-Delete'>Delete</button>"+
                "</td>"+
            "</tr>");
         } 
    }
    else
    {
        $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.error);
    }
});

$('#next_race_info_current').click(function(){
    var tabledata = [];
    var name = [];
    var sp = [];
    var color = [];
    $('#next_race_info_table').find(".info_name").each(function( index ) {
        name.push($( this ).val());
    });
    $('#next_race_info_table').find(".info_sp").each(function( index ) {
        sp.push($( this ).val());
    });
    $('#next_race_info_table').find(".info_color").each(function( index ) {
        color.push($( this ).val());
    });
    for (let i=0; i<name.length; i++)
        tabledata.push({name:name[i], sp:sp[i], color:color[i]});
    Client.socket.emit('cur_race_save', {tabledata: tabledata, time:$('#next_race_time').val(), name:$('#next_race_name').val()});
})

$('#next_race_info_save').click(function(){
    var tabledata = [];
    var name = [];
    var sp = [];
    var color = [];
    $('#next_race_info_table').find(".info_name").each(function( index ) {
        name.push($( this ).val());
    });
    $('#next_race_info_table').find(".info_sp").each(function( index ) {
        sp.push($( this ).val());
    });
    $('#next_race_info_table').find(".info_color").each(function( index ) {
        color.push($( this ).val());
    });
    for (let i=0; i<name.length; i++)
        tabledata.push({name:name[i], sp:sp[i], color:color[i]});
    Client.socket.emit('next_race_save', {tabledata: tabledata, time:$('#next_race_time').val(), name:$('#next_race_name').val()});
});

Client.socket.on('next_race_save', function(data){
    if(data.result){
        $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Update Succeed');
    }
    else
    {
        $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.error);
    }
});

$('#stream_url_save').click(function(){
    Client.socket.emit('stream_url_save', $('#stream_url').val());
});

$('#live_feedback_save').click(function(){
    Client.socket.emit('feed_category_save', $('#live_feedback').val());
});


$('#card_title_save').click(function(){
    Client.socket.emit('card_title_save', $('#card_title').val());
});

Client.socket.on('stream_url_save', function(data){
    if(data.result){
        $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Update Succeed');
    }
    else
    {
        $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.error);
    }
});

$('#betting_info_save').click(function(){
    var tabledata = [];
    var time = [];
    var name = [];
    var text = [];
    $('#betting_info_table').find(".info_time").each(function( index ) {
        time.push($( this ).val());
    });
    $('#betting_info_table').find(".info_name").each(function( index ) {
        name.push($( this ).val());
    });
    $('#betting_info_table').find(".info_text").each(function( index ) {
        text.push($( this ).val());
    });
    for (let i=0; i<name.length; i++)
        tabledata.push({time:time[i], name:name[i], text:text[i]});
    Client.socket.emit('betting_info_save', tabledata);
});

Client.socket.on('betting_info_save', function(data){
    if(data.result){
        $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Update Succeed');
    }
    else
    {
        $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.error);
    }
});

$('#tips_info_save').click(function(){
    var tabledata = [];
    var race = [];
    var selection = [];
    var price = [];
    var note = [];
    $('#tips_info_table').find(".info_race").each(function( index ) {
        race.push($( this ).val());
    });
    $('#tips_info_table').find(".info_selection").each(function( index ) {
        selection.push($( this ).val());
    });
    $('#tips_info_table').find(".info_price").each(function( index ) {
        price.push($( this ).val());
    });
    $('#tips_info_table').find(".info_notes").each(function( index ) {
        note.push($( this ).val());
    });
    for (let i=0; i<race.length; i++)
        tabledata.push({race:race[i], selection:selection[i], price:price[i], note:note[i]});
    Client.socket.emit('tips_info_save', {tabledata: tabledata, title:$('#tips_source').val()});
});

Client.socket.on('tips_info_save', function(data){
    if(data.result){
        $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Update Succeed');
    }
    else
    {
        $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.error);
    }
});

$('#odds_info_save').click(function(){
    var tabledata = [];
    var date = [];
    var meeting = [];
    var overnight = [];
    var overnighturl = [];
    var morning = [];
    var morningurl = [];
    $('#odds_info_table').find(".info_date").each(function( index ) {
        date.push($( this ).val());
    });
    $('#odds_info_table').find(".info_meeting").each(function( index ) {
        meeting.push($( this ).val());
    });
    $('#odds_info_table').find(".info_overnight").each(function( index ) {
        overnight.push($( this ).val());
    });
    $('#odds_info_table').find(".info_overnighturl").each(function( index ) {
        overnighturl.push($( this ).val());
    });
    $('#odds_info_table').find(".info_morning").each(function( index ) {
        morning.push($( this ).val());
    });
    $('#odds_info_table').find(".info_morningurl").each(function( index ) {
        morningurl.push($( this ).val());
    });
    for (let i=0; i<date.length; i++)
        tabledata.push({date:date[i], meeting:meeting[i], overnight:overnight[i], overnighturl:overnighturl[i], morning:morning[i], morningurl:morningurl[i]});
    Client.socket.emit('odd_info_save', {tabledata: tabledata});
});

Client.socket.on('odd_info_save', function(data){
    if(data.result){
        $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Update Succeed');
    }
    else
    {
        $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.error);
    }
});

$('body').on('click', '#pdf_upload_button', function(){
    var formData = new FormData();
    if($('#pdf_file').length == 0)
        return;
    formData.append('file', $('#pdf_file')[0].files[0]);
    $.ajax({
        url : '/admin/setting/pdf_upload',
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Update Succeed');
            Client.socket.emit('pdf_source_updated', {});
        },
        error: function(data){
            $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.message);
        }
    });
})

$('body').on('click', '#odd_file_upload_button', function(){
    var formData = new FormData();
    if($('#odd_file').length == 0)
        return;
    formData.append('file', $('#odd_file')[0].files[0]);
    var fileName = $('#odd_file')[0].files[0].name;
    $.ajax({
        url : '/admin/setting/odds/file_upload',
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            if(data.error) {
                $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html(data.error);
            } else {
                $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Upload Succeed');
                $('#odds_info_table .info_overnighturl').each(function(index){
                    $(this).append("<option class = '" + fileName + "' value='" + fileName + "'>" + fileName + "</option>");
                });
                $('#odds_info_table .info_morningurl').each(function(index){
                    $(this).append("<option class = '" + fileName + "' value='" + fileName + "'>" + fileName + "</option>");
                });
                $("#odds_file_table").append("<tr>"+
                    "<td class='border py-2'>"+
                    fileName+
                    "</td> "+
                    "<td class='border py-2'>"+
                    "<button type='button' class='Odd-File-Delete'>Delete</button>"+
                    "</td>"+
                    "</tr>");
            }
        },
        error: function(data){
            $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.message);
        }
    });
})

$('body').on('click', '.Odd-File-Delete', function(){
    var fileName = $(this).closest('tr').find('.Odd-File-Name').first().html();
    var self = this;
    $.ajax({
        url : '/admin/setting/odds/delete',
        type : 'POST',
        data : {fileName:fileName},
        success : function(data) {
            $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Upload Succeed');
            self.closest('tr').remove();
            $('#odds_info_table .info_overnighturl').each(function(index){
                $(this).remove('.' + fileName);
            });
            $('#odds_info_table .info_morningurl').each(function(index){
                $(this).remove('.' + fileName);
            });
        },
        error: function(data){
            $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.message);
        }
    });
})

$('body').on('click', '#odd_file_clear_button', function(){
    $.ajax({
        url : '/admin/setting/odds/clear',
        type : 'POST',
        data : {},
        success : function(data) {
            $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Upload Succeed');
            $('#odds_file_table').html('');
        },
        error: function(data){
            $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.message);
        }
    });
})
