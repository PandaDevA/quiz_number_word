$('#tips_info_add').click(function(){
    if($('#user_table').find('td').last().attr('data-word') == '') return;
    $('#user_table').append("<tr>"+
        "<td class='border py-2'>"+
        "<input class='info_race info_text' type='text' value='' placeholder='word'/>"+
        "</td>"+
        "<td class='border py-2'>"+
        "<textarea class='info_text' value='' placeholder='matchArray' ></textarea>"+
        "</td>"+    
        "<td class='border usercell py-2' data-word=''>"+
            "<button type='button' class='User-Delete'>Delete</button>" +
        "</td>" +
        "</tr>");
})

// $('body').on('click', '#tips_info_clear', function(){
//     $('#user_table').html("");
// })

function update_user(filter, page, count){
    $.blockUI({ message: '<h1><img src="/img/busy.gif" /> Just a moment...</h1>' });
    $.ajax({
        url : '/setting/word',
        type : 'POST',
        data : {
            filter: filter,
            page: page,
            count: count
        },
        success : function(wordData) {
            data = wordData.words;
            console.log(data);
            if(!data.pageInfo)return;
            $('#user-pagination').empty();
            let pageCount = Math.ceil(data.pageInfo.count / data.pageInfo.perPage);
            if ( pageCount> 0) {
                let content = "";
                content+="<ul class='pagination text-center'>";
                if (data.pageInfo.curPage == 1) {
                    content+="<li class='disabled'>First</li>";
                } else {
                    content+="<li data-page='1'>First</li>";
                }
                var i = (Number(data.pageInfo.curPage) > 5 ? Number(data.pageInfo.curPage) - 4 : 1);
                if (i !== 1) {
                    content+="<li class='disabled'>...</li>";
                }
                for (; i <= (Number(data.pageInfo.curPage) + 4) && i <= pageCount; i++) {
                    if (i == data.pageInfo.curPage) {
                        content+="<li class='active'>" + i  + "</li>";
                    } else {
                        content+="<li data-page='" + i + "'>" + i + "</li>";
                    }
                    if (i == Number(data.pageInfo.curPage) + 4 && i < pageCount) {
                        content+="<li class='disabled'>...</li>";
                    }
                }
                if (data.pageInfo.curPage == pageCount) {
                    content+="<li class='disabled'>Last</li>";
                } else {
                    content+="<li data-page='" + pageCount + "'>Last</li>";
                }
                content+="</ul>";
                $('#user-pagination').html(content);
            }
            $('#user_table').empty();
            for(var i=0; i<data.result.length; i++) {
                $('#user_table').append("<tr>"+
                    "<td class='border py-2'>"+
                    "<input class='info_race info_text' type='text' value='" + data.result[i].word + "' placeholder='word' readonly/>"+
                    "</td>"+
                    "<td class='border py-2'>"+
                    "<textarea class='info_text' value='' placeholder='matchArray' readonly>" + data.result[i].matchArray.join(',') + "</textarea>"+
                    "</td>"+    
                    "<td class='border usercell py-2' data-word='" + data.result[i].word + "'>"+
                        "<button type='button' class='User-Delete'>Delete</button>" +
                    "</td>" +
                    "</tr>");
            } 
        },
        error: function(data){
        }
    });
}

$('body').on('click', '#user_find', function(){
    update_user($('#user_filter').val(), 1,  $('#user_perPage').val());
})

$('body').on('change', '#user_perPage', function(){
    update_user($('#user_filter').val(), 1,  $('#user_perPage').val());
})

$('body').on('click', '#user-pagination li', function(){
    if(!$(this).data('page'))
        return;
    update_user($('#user_filter').val(), $(this).data('page'),  $('#user_perPage').val());
})

$('body').on('click', '.User-Delete', function(){
    if($(this).closest('td').data('word') == '') {
        $(this).closest('tr').remove(); return;}
    var returnVal = confirm("Are you sure?");
    if(returnVal) {
        $.blockUI({ message: '<h1><img src="/img/busy.gif" /> Just a moment...</h1>' });
        $.ajax({
            url : '/setting/delete',
            type : 'POST',
            data : {
                word: $(this).closest('td').data('word'),
            },
            success : function(data) {
                var filter = $('#user_filter').val();
                var page = 1;
                var perPage = $('#user_perPage').val();
                update_user(filter, page, perPage);
            },
            error: function(data){
                if(data.error) alert("Error occured..."+data.error);
                else alert("Error occured...");
            }
        });
    }
})

$('#tips_info_save').click(function(){
    var last = $('#user_table').find('tr').last();
    if(last.find('input').first().val() == '') {
        $('#user_table').find('tr').last().remove();
        return;
     }
    var returnVal = confirm("Are you sure?");
    if(returnVal) {
        $.blockUI({ message: '<h1><img src="/img/busy.gif" /> Just a moment...</h1>' });
        $.ajax({
            url : '/setting/add',
            type : 'POST',
            data : {
                word: last.find('input').first().val(),
                matchArrayString: last.find('textarea').first().val()
            },
            success : function(data) {
                $('#user_table').find('input').last().attr('readonly', true);
                $('#user_table').find('textarea').last().attr('readonly', true);
                var filter = $('#user_filter').val();
                var page = 1;
                var perPage = $('#user_perPage').val();
                update_user(filter, page, perPage);
            },
            error: function(data){
                if(data.error) alert("Error occured..."+data.error);
                else alert("Error occured...");
            }
        });
    }
})

function update_row_num(tbl_class){
    $(tbl_class).find("tr > td.row_num").each(function( index ) {
        $( this ).html(index+1);
    });
}

$(document).ajaxStop($.unblockUI);