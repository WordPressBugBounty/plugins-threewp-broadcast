/**
	@brief		Handles the postbox (meta box).
	@since		2014-11-02 09:54:16
**/
;(function( $ )
{
    $.fn.extend(
    {
        broadcast_postbox: function()
        {
            return this.each( function()
            {
                var $this = $(this);

				var $blogs_container;
				var $blog_inputs;
				var $invert_selection;
				var $select_all;
				var $selection_change_container;
				var $show_hide;
				var $blog_counter;

				/**
					* @brief		Add a counter after the "Broadcast to" text.
					* @since		2025-03-15 07:28:56
				**/
				$this.enable_blog_counter = function()
				{
					var $legend = $( 'legend', $this.$blogs_container ).first();
					var $counter = $( '<span class="counters">' );
					$counter.append( ' (' );
					var $selected_blogs = $( '<span class="selected_blogs">' );
					$selected_blogs.appendTo( $counter );

					$counter.append( ' / ' );

					var $total_blogs = $( '<span class="total_blogs">' );
					$total_blogs.appendTo( $counter );

					$counter.append( ')' );

					$counter.appendTo( $legend );

					recount_selected_blogs = function()
					{
						var selected = $( 'input:checked', $this.$blogs_container ).length;
						selected = parseInt( selected );
						$selected_blogs.html( selected );
						$total_blogs.html( $this.$blog_inputs.length );
					}
					$this.$blog_inputs.on( 'change', recount_selected_blogs );
					$this.$blog_inputs.change();
				}

				/**
					Hides all the blogs ... except those that have been selected.
				**/
				$this.hide_blogs = function()
				{
					$this.$blogs_container.removeClass( 'opened' ).addClass( 'closed' );
					$this.$show_hide.html( broadcast_strings.show_all );

					// Hide all those blogs that aren't checked
					$this.$blog_inputs.each( function( index, item )
					{
						var $input = $( this );
						var checked = $input.prop( 'checked' );
						// Ignore inputs that are supposed to be hidden.
						if ( $input.prop( 'hidden' ) === true )
							return;
						if ( ! checked )
							$input.parent().parent().hide();
					} );
				},

				/**
					Reshows all the hidden blogs.
				**/
				$this.show_blogs = function()
				{
					this.$blogs_container.removeClass( 'closed' ).addClass( 'opened' );
					this.$show_hide.html( broadcast_strings.hide_all );
					$.each( $this.$blog_inputs, function( index, item )
					{
						var $input = $( this );
						if ( $input.prop( 'hidden' ) === true )
							return;
						$input.parent().parent().show();
					} );
				}

				// If the box doesn't contain any input information, do nothing.
				if ( $( 'input', $this ).length < 1 )
					return;

				$this.$blogs_container = $( '.blogs.html_section', $this );

				// If there is no blogs selector, then there is nothing to do here.
				if ( $this.$blogs_container.length < 1 )
					return;

				$this.$blog_inputs = $( 'input.checkbox', $this.$blogs_container );

				// Container for selection change.
				$this.$selection_change_container = $( '<div />' )
					.addClass( 'clear selection_change_container howto' );

				switch( broadcast_blog_selector_position )
				{
					case 'top':
						$this.$selection_change_container.prependTo( $this.$blogs_container );
					break;
					default:
						$this.$selection_change_container.appendTo( $this.$blogs_container );
				}

				// Append "Select all / none" text.
				$this.$select_all = $( '<span />' )
					.addClass( 'selection_change select_deselect_all' )
					.on( 'click', function()
					{
						var checkedStatus = ! $this.$blog_inputs.first().prop( 'checked' );
						$this.$blog_inputs.each( function(index, item)
						{
							var $item = $( item );
							// Only change the status of the blogs that aren't disabled.
							if ( $item.prop( 'disabled' ) != true )
								$item.prop( 'checked', checkedStatus );
						} );
					})
					.html( broadcast_strings.select_deselect_all )
					.appendTo( $this.$selection_change_container );

				$this.$selection_change_container.append( '&emsp;' );

				$this.$invert_selection = $( '<span />' )
					.on( 'click', function()
					{
						$this.$blog_inputs.each( function(index, item)
						{
							var $item = $( item );
							var checked = $item.prop( 'checked' );
							$item.prop( 'checked', ! checked );
						} );
					})
					.addClass( 'selection_change invert_selection' )
					.text( broadcast_strings.invert_selection )
					.appendTo( $this.$selection_change_container );

				// Need to hide the blog list?
				try
				{
					if ( broadcast_blogs_to_hide )
						true;
				}
				catch( e )
				{
					broadcast_blogs_to_hide = 5;
				}

				if ( $this.$blog_inputs.length > broadcast_blogs_to_hide )
				{
					$this.$show_hide = $( '<div />' )
						.addClass( 'show_hide howto' )
						.prependTo( $this.$blogs_container )
						.on( 'click', function()
						{
							if ( $this.$blogs_container.hasClass( 'opened' ) )
								$this.hide_blogs();
							else
								$this.show_blogs();
						} );

					$this.hide_blogs();
				}

				if ( broadcast_setting_blogs_show_counter > -1 )
					if ( $this.$blog_inputs.length > broadcast_setting_blogs_show_counter )
						$this.enable_blog_counter();

				// GROUP functionality: Allow blogs to be mass selected, unselected.
				$( ".blog_groups select", $this ).on( 'change', function()
				{
					var $groups = $( this );
					var blogs = $groups.val().split(' ');
					for ( var counter=0; counter < blogs.length; counter++)
					{
						var $blog = $( "#plainview_sdk_broadcast_form2_inputs_checkboxes_blogs_" + blogs[counter], $this.$blogs_container );
						$blog.trigger( 'click' );
					}

					// If the blog list is closed, then expand and then close again to show the newly selected blogs.
					if ( $this.$blogs_container.hasClass( 'closed' ) )
						$this.$show_hide.trigger( 'click' ).trigger( 'click' );
				} ).trigger( 'change' );

				// Unchecked child blogs
				var $unchecked_child_blogs_div = $( ".form_item_plainview_sdk_broadcast_form2_inputs_select_unchecked_child_blogs", $this ).hide();
				var $unchecked_child_blogs = $( "select", $unchecked_child_blogs );

				$( ".blogs.checkboxes .linked input", $this ).on( 'change',  function()
				{
					var $this = $( this );
					var checked = $this.is( ':checked' );

					// Show the uncheck select.
					if ( ! checked )
					{
						$unchecked_child_blogs_div.show();
					}
					else
					{
						// We can only hide it if all linked blogs are checked.
						var unchecked = $( ".blogs.checkboxes .linked input:not(:checked)", $this ).length == 0;
						if ( unchecked )
							$unchecked_child_blogs_div.hide();
					}
				} );


            } ); // return this.each( function()
        } // plugin: function()
    } ); // $.fn.extend({
} )( jQuery );
