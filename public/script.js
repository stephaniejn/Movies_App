$(function(){

	$('.deleteFav').on('click', function(event) 
		{console.log("test")
		event.preventDefault();
		// alert($(this).data('id'))

		var thisDeleteButton = $(this);

		$.ajax({
			url:'/movies/watchlist/'+thisDeleteButton.data('id'),
			type: 'DELETE',
			success: function(result){
				thisDeleteButton.closest('li').fadeOut('slow', function(){
					$(this).remove();
				})
			}
		})
	})

	$('.add').click(function () {
		console.log("clicking!!")
		var thisAddButton= $(this);
		var AddButtonYear = $(this).data("year");
		var AddButtonTitle = $(this).data("title");
		var AddButtonIMDB = $(this).data("imdb_code");
		console.log(AddButtonIMDB);
		console.log(AddButtonTitle);
		console.log(AddButtonYear);
		$.post('/movies/'+AddButtonIMDB,
			{title:AddButtonTitle, year:AddButtonYear, imdb_code:AddButtonIMDB}
			, function(data){alert('ADDED!');
			thisAddButton.closest('div').fadeOut("slow")

		});
	});
})