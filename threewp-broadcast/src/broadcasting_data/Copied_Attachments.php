<?php

namespace threewp_broadcast\broadcasting_data;

use Traversable;

/**
	@brief		Convenience methods for handling copied attachments.
	@details	Created mainly as a convenience class for get and has lookups.
	@since		2015-07-01 21:22:34
**/
class Copied_Attachments
	extends \threewp_broadcast\collection
	implements \IteratorAggregate
{
	/**
		@brief		The broadcasting data object.
		@since		2015-06-06 09:02:08
	**/
	public $broadcasting_data;

	/**
		@brief		Constructor.
		@since		2015-07-01 21:23:44
	**/
	public function __construct( $broadcasting_data )
	{
		$this->broadcasting_data = $broadcasting_data;
	}

	/**
		@brief		Add a copied attachment.
		@since		2015-08-02 10:35:45
	**/
	public function add( $old_attachment, $new_attachment )
	{
		$pair = (object)[];
		$pair->new = $new_attachment;
		$pair->new->id = $pair->new->ID;		// Lowercase is expected.
		$pair->old = $old_attachment;
		$items = $this->get_items();
		$items->set( $old_attachment->ID, $pair );
		return $this;
	}

	/**
		@brief		Count for this blog.
		@since		2018-09-10 15:01:10
	**/
	public function count() : int
	{
		$items = $this->get_items();
		return $items->count();
	}

	/**
		@brief		Return the BCD object where our data is stored.
		@since		2018-07-04 13:59:28
	**/
	public function data()
	{
		return $this->broadcasting_data->copied_attachments;
	}

	/**
		@brief		Return the equivalent new attachment ID of this old attachment ID.
		@since		2015-07-01 21:39:43
	**/
	public function get( $old_attachment_id, $default = null )
	{
		return $this->get_attachment_id_on_blog( $old_attachment_id, get_current_blog_id() );
	}

	/**
		@brief		Retrieve the complete attachment.
		@since		2015-07-29 16:42:44
	**/
	public function get_attachment( $old_attachment_id )
	{
		$items = $this->data()->collection( get_current_blog_id() );
		if ( ! $items->has( $old_attachment_id ) )
			return false;
		return $items->get( $old_attachment_id )->new;
	}

	/**
		@brief		Return the ID of this "old" attachment ID on this specified blog.
		@since		2023-04-04 10:29:42
	**/
	public function get_attachment_id_on_blog( $old_attachment_id, $blog_id )
	{
		$items = $this->data()->collection( $blog_id );
		if ( ! $items->has( $old_attachment_id ) )
			return false;
		return $items->get( $old_attachment_id )->new->ID;
	}

	/**
		@brief		Return all of the items on this blog.
		@since		2018-09-10 15:11:05
	**/
	public function get_items()
	{
		return $this->data()->collection( get_current_blog_id() );
	}

	/**
	 * Get an iterator for the items.
	 *
	 * @return ArrayIterator
	 */
	public function getIterator() : Traversable
	{
		$items = $this->get_items()->to_array();
		return new \ArrayIterator( $items );
	}
}
