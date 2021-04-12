/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();
Client.socket.emit('join', {joinTo: join_events});

Client.socket.on('cur_race_update',function(data){
    $('#cur_race_title').html(data.time + " " + data.name);
    $('#cur_race_info_table').html('');
    for(let i=0; i<data.dataArray.length; i++)
    {
        $('#cur_race_info_table').append("<tr><td class='border px-4 py-2 row_num'></td>"+
        "<td class='border px-4 py-2'>" + data.dataArray[i].name + "</td>"+
        "<td class='border px-4 py-2 " + data.dataArray[i].color + "'>" + data.dataArray[i].sp + "</td></tr>");
    }
    update_row_num('#cur_race_info_table');
});

Client.socket.on('next_race_update',function(data){
    $('#next_race_title').html(data.time + " " + data.name);
    $('#next_race_info_table').html('');
    for(let i=0; i<data.dataArray.length; i++)
    {
        $('#next_race_info_table').append("<tr><td class='border px-4 py-2 row_num'></td>"+
        "<td class='border px-4 py-2'>" + data.dataArray[i].name + "</td>"+
        "<td class='border px-4 py-2 " + data.dataArray[i].color + "'>" + data.dataArray[i].sp + "</td></tr>");
    }
    update_row_num('#next_race_info_table');
});

Client.socket.on('stream_url_update',function(data){
    $('#stream_preview').attr('src',data.url);
});

Client.socket.on('feed_category_update',function(data){
    if(data.category == 'V_Sporting')
    {
        $('.live_result_panel .panel_content').first().html("<a class='twitter-timeline' href='https://twitter.com/V_Sporting?ref_src=twsrc%5Etfw'>Tweets by V_Sporting</a>");
    }

    if(data.category == 'ClubHipico_Stgo')
    {
        var element = $('.live_result_panel .panel_content');
        $('.live_result_panel .panel_content').first().html("<a class='twitter-timeline' href='https://twitter.com/ClubHipico_Stgo?ref_src=twsrc%5Etfw'>Tweets by ClubHipico_Stgo</a>");
    }

    if(data.category == 'CHCmediocamino')
    {
        $('.live_result_panel .panel_content').first().html("<a class='twitter-timeline' href='https://twitter.com/CHCmediocamino?ref_src=twsrc%5Etfw'>Tweets by CHCmediocamino</a>");
    }

    if(data.category == 'hipodromo_chile')
    {
        $('.live_result_panel .panel_content').first().html("<a class='twitter-timeline' href='https://twitter.com/hipodromo_chile?ref_src=twsrc%5Etfw'>Tweets by hipodromo_chile</a>");
    }
    location.reload();
});

Client.socket.on('betting_info_update', function(data){
    var betting_panel = $('.bet_info_panel .panel_content').first();
    betting_panel.html('');
    for(let i=0; i<data.length; i++) {
        betting_panel.append("<div class='bet_info_item'>" + 
            "<p>" + data[i].time + ' ' + data[i].name + ' ' + data[i].text + "</p>" +
            "</div>");
    }
});

Client.socket.on('card_title_update', function(data){
    $('#card_title').html(data);
});

Client.socket.on('pdf_source_update', function(url){
    $('#card_view_container').html('<object id="card_view" data='+url+' type="application/pdf" width="100%" height="600px" style="border:2px solid black;">'+
    '</object>');
});

Client.socket.on('tips_info_update',function(data){
    $('#tip_source').html('Early information for racing at ' + data.title);
    $('#tips_info_table').html('');
    for(let i=0; i<data.dataArray.length; i++)
    {
        $('#tips_info_table').append("<tr>"+
            "<td class='border px-4 py-2'>"+
                data.dataArray[i].race+
            "</td>"+
            "<td class='border px-4 py-2'>"+
                data.dataArray[i].selection+
            "</td>"+
            "<td class='border px-4 py-2'>"+
                data.dataArray[i].price+
            "<td class='border px-4 py-2'>"+
                data.dataArray[i].note+
            "</td>"+
            "</tr>");
    }
});

Client.socket.on('odd_info_update',function(data){
    $('#odds_info_table').html('');
    for(let i=0; i<data.dataArray.length; i++)
    {
        let content = '';
        content += "<tr>"+
                    "<td class='border px-4 py-2'>"+
                        data.dataArray[i].date+
                    "</td>"+
                    "<td class='border px-4 py-2'>"+
                        data.dataArray[i].meeting+
                    "</td>"+
                    "<td class='border px-4 py-2'>";
        if(data.dataArray[i].overnighturl=='') { 
            content += data.dataArray[i].overnight;
        } else {
            content += "<a href='/odds/" + data.dataArray[i].overnighturl + "' download>"+
                            "available</a>";
        }
        content += "</td><td class='border px-4 py-2'>";
        if(data.dataArray[i].morningurl=='') { 
            content += data.dataArray[i].morning;
        } else {
            content += "<a href='/odds/" + data.dataArray[i].morningurl + "' download>"+
                            "available</a>";
        }
        content+="</td></tr>";
        $('#odds_info_table').append(content);
    }
});

