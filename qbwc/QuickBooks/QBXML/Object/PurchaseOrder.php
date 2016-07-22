<?php

/**
 * QuickBooks PurchaseOrder object container
 * 
 * @author Keith Palmer <keith@consolibyte.com>
 * @license LICENSE.txt 
 * 
 * @package QuickBooks
 * @subpackage Object
 */

/**
 * 
 */
QuickBooks_Loader::load('/QuickBooks/QBXML/Object.php');

/**
 * 
 */
QuickBooks_Loader::load('/QuickBooks/QBXML/Object/Generic.php');

/**
 * 
 */
QuickBooks_Loader::load('/QuickBooks/QBXML/Object/PurchaseOrder/PurchaseOrderLine.php');

/**
 * 
 * 
 */
class QuickBooks_QBXML_Object_PurchaseOrder extends QuickBooks_QBXML_Object
{
	/**
	 * Create a new QuickBooks PurchaseOrder object
	 * 
	 * @param array $arr
	 */
	public function __construct($arr = array())
	{
		parent::__construct($arr);
	}
	
	/**
	 * Alias of {@link QuickBooks_Object_PurchaseOrder::setTxnID()}
	 */
	public function setTransactionID($TxnID)
	{
		return $this->setTxnID($TxnID);
	}

  public function getTransactionID()
  {
    return $this->getTxnID();
  }
	
	/**
	 * Set the transaction ID of the PurchaseOrder object
	 * 
	 * @param string $TxnID
	 * @return boolean
	 */
	public function setTxnID($TxnID)
	{
		return $this->set('TxnID', $TxnID);
	}

  public function getTxnId()
  {
    return $this->get('TxnID');
  }
	
	/**
	 * Set the customer ListID
	 * 
	 * @param string $ListID
	 * @return boolean
	 */
	public function setVendorListID($ListID)
	{
		return $this->set('VendorRef ListID' , $ListID);
	}
	
	/**
	 * Set the customer ApplicationID (auto-replaced by the API with a ListID)
	 * 
	 * @param mixed $value
	 * @return boolean
	 */
	public function setVendorApplicationID($value)
	{
		return $this->set('VendorRef ' . QUICKBOOKS_API_APPLICATIONID, $this->encodeApplicationID(QUICKBOOKS_OBJECT_CUSTOMER, QUICKBOOKS_LISTID, $value));
	}

  public function getVendorApplicationID()
  {
    return $this->get('VendorRef ' . QUICKBOOKS_API_APPLICATIONID);
  }
	
	/**
	 * Set the customer name
	 * 
	 * @param string $name
	 * @return boolean
	 */
	public function setVendorName($name)
	{
		return $this->set('VendorRef FullName', $name);
	}
	
	/**
	 * Get the customer ListID
	 * 
	 * @return string
	 */
	public function getVendorListID()
	{
		return $this->get('VendorRef ListID');
	}
	
	/**
	 * Get the customer name
	 * 
	 * @return string
	 */
	public function getVendorName()
	{
		return $this->get('VendorRef FullName');
	}
	
	public function setClassListID($ListID)
	{
		return $this->set('ClassRef ListID', $ListID);
	}
	
	public function setClassApplicationID($value)
	{
		return $this->set('ClassRef ' . QUICKBOOKS_API_APPLICATIONID, $this->encodeApplicationID(QUICKBOOKS_OBJECT_CLASS, QUICKBOOKS_LISTID, $value));
	}

  public function getClassApplicationID()
  {
		return $this->get('ClassRef ' . QUICKBOOKS_API_APPLICATIONID);
  }
	
	public function setClassName($name)
	{
		return $this->set('ClassRef FullName', $name);
	}
	
	public function getClassName()
	{
		return $this->get('ClassRef FullName');
	}
	
	public function getClassListID()
	{
		return $this->get('ClassRef ListID');
	}
	
	public function setARAccountApplicationID($value)
	{
		return $this->set('ARAccountRef ' . QUICKBOOKS_API_APPLICATIONID, $this->encodeApplicationID(QUICKBOOKS_OBJECT_ACCOUNT, QUICKBOOKS_LISTID, $value));
	}

	public function getARAccountApplicationID()
	{
		return $this->get('ARAccountRef ' . QUICKBOOKS_API_APPLICATIONID);
	}
	
	public function setARAccountListID($ListID)
	{
		return $this->set('ARAccountRef ListID', $ListID);
	}
	
	public function setARAccountName($name)
	{
		return $this->set('ARAccountRef FullName', $name);
	}
	
	public function getARAccountListID()
	{
		return $this->get('ARAccountRef ListID');
	}
	
	public function getARAccountName()
	{
		return $this->get('ARAccountRef FullName');
	}
	
	public function setTemplateApplicationID($value)
	{
		return $this->set('TemplateRef ' . QUICKBOOKS_API_APPLICATIONID, $this->encodeApplicationID(QUICKBOOKS_OBJECT_TEMPLATE, QUICKBOOKS_LISTID, $value));
	}

	public function getTemplateApplicationID()
	{
		return $this->get('TemplateRef ' . QUICKBOOKS_API_APPLICATIONID);
	}
	
	public function setTemplateName($name)
	{
		return $this->set('TemplateRef FullName', $name);
	}
	
	public function setTemplateListID($ListID)
	{
		return $this->set('TemplateRef ListID', $ListID);
	}
	
	public function getTemplateName()
	{
		return $this->get('TemplateRef FullName');
	}
	
	public function getTemplateListID()
	{
		return $this->get('TemplateRef ListID');
	}
	
	/**
	 * Set the transaction date
	 * 
	 * @param string $date
	 * @return boolean
	 */
	public function setTxnDate($date)
	{
		return $this->setDateType('TxnDate', $date);
	}
	
	/**
	 * Alias of {@link QuickBooks_Object_PurchaseOrder::setTxnDate()}
	 */
	public function setTransactionDate($date)
	{
		return $this->setTxnDate($date);
	}
	
	/**
	 * Get the transaction date
	 * 
	 * @return string
	 */
	public function getTxnDate($format = 'Y-m-d')
	{
		return $this->getDateType('TxnDate', $format);
	}
	
	/**
	 * Alias of {@link QuickBooks_Object_PurchaseOrder::getTxnDate()}
	 */
	public function getTransactionDate()
	{
		return $this->getTxnDate();
	}
	
	/**
	 * Set the reference number
	 * 
	 * @param string $str
	 * @return boolean
	 */
	public function setRefNumber($str)
	{
		return $this->set('RefNumber', $str);
	}
	
	/**
	 * Get the reference number
	 * 
	 * @return string
	 */
	public function getRefNumber()
	{
		return $this->get('RefNumber');
	}
	
	/**
	 * 
	 * 
	 * @param string $part
	 * @param array $defaults
	 * @return array
	 */
	public function getShipAddress($part = null, $defaults = array())
	{
		if (!is_null($part))
		{
			return $this->get('ShipAddress ' . $part);
		}
		
		return $this->getArray('ShipAddress *', $defaults);
	}
	
	/**
	 * Set the shipping address for the invoice
	 * 
	 * @param string $addr1
	 * @param string $addr2
	 * @param string $addr3
	 * @param string $addr4
	 * @param string $addr5
	 * @param string $city
	 * @param string $state
	 * @param string $postalcode
	 * @param string $country
	 * @param string $note
	 * @return boolean
	 */
	public function setShipAddress($addr1, $addr2 = '', $addr3 = '', $addr4 = '', $addr5 = '', $city = '', $state = '', $postalcode = '', $country = '', $note = '')
	{
    $b = FALSE;
		for ($i = 1; $i <= 5; $i++)
		{
			$this->set('ShipAddress Addr' . $i, ${'addr' . $i});
		}
		
		$this->set('ShipAddress City', $city);
		$this->set('ShipAddress State', $state);
		$this->set('ShipAddress PostalCode', $postalcode);
		$this->set('ShipAddress Country', $country);
		$this->set('ShipAddress Note', $note);  
	}
	
	/**
	 * 
	 * 
	 * @param string $part
	 * @param array $defaults
	 * @return array
	 */
	public function getBillAddress($part = null, $defaults = array())
	{
		if (!is_null($part))
		{
			return $this->get('BillAddress ' . $part);
		}
		
		return $this->getArray('BillAddress *', $defaults);
	}
	
	/**
	 * Set the billing address for the invoice
	 * 
	 * @param string $addr1
	 * @param string $addr2
	 * @param string $addr3
	 * @param string $addr4
	 * @param string $addr5
	 * @param string $city
	 * @param string $state
	 * @param string $postalcode
	 * @param string $country
	 * @param string $note
	 * @return void
	 */
	public function setBillAddress($addr1, $addr2 = '', $addr3 = '', $addr4 = '', $addr5 = '', $city = '', $state = '', $postalcode = '', $country = '', $note = '')
	{
		for ($i = 1; $i <= 5; $i++)
		{
			$this->set('BillAddress Addr' . $i, ${'addr' . $i});
		}
		
		$this->set('BillAddress City', $city);
		$this->set('BillAddress State', $state);
		$this->set('BillAddress PostalCode', $postalcode);
		$this->set('BillAddress Country', $country);
		$this->set('BillAddress Note', $note);  
	}
	
	public function setTermsListID($ListID)
	{
		return $this->set('TermsRef ListID', $ListID);
	}
	
	public function setTermsApplicationID($value)
	{
		return $this->set('TermsRef ' . QUICKBOOKS_API_APPLICATIONID, $this->encodeApplicationID(QUICKBOOKS_OBJECT_TERMS, QUICKBOOKS_LISTID, $value));
	}

	public function getTermsApplicationID()
	{
		return $this->get('TermsRef ' . QUICKBOOKS_API_APPLICATIONID);
	}
	
	public function setTermsName($name)
	{
		return $this->set('TermsRef FullName', $name);
	}
	
	public function getTermsName()
	{
		return $this->get('TermsRef FullName');
	}
	
	public function getTermsListID()
	{
		return $this->get('TermsRef ListID');
	}
	
	public function setDueDate($date)
	{
		return $this->setDateType('DueDate', $date);
	}
	
	public function getDueDate($format = 'Y-m-d')
	{
		return $this->getDateType('DueDate', $format);
	}
	
	public function getFOB()
	{
		return $this->get('FOB');
	}
	
	public function setFOB($fob)
	{
		return $this->set('FOB', $fob);
	}
	
	public function setShipDate($date)
	{
		return $this->setDateType('ShipDate', $date);
	}
	
	public function getShipDate($format = 'Y-m-d')
	{
		return $this->getDateType('ShipDate', $format);
	}
	
	public function setShipMethodApplicationID()
	{
		
	}

	public function getShipMethodApplicationID()
	{
		
	}
	
	public function setShipMethodName()
	{
		
	}
	
	public function setShipMethodListID()
	{
		
	}
	
	public function getShipMethodName()
	{
		
	}
	
	public function getShipMethodListID()
	{
		
	}
	
	public function setPurchaseTaxItemListID()
	{
		
	}
	
	public function setPurchaseTaxItemApplicationID()
	{
		
	}

	public function getPurchaseTaxItemApplicationID()
	{
		
	}
	
	public function setPurchaseTaxItemName()
	{
		
	}
	
	public function getPurchaseTaxItemName()
	{
		
	}
	
	public function getPurchaseTaxItemListID()
	{
		
	}
	
	public function setMemo($memo)
	{
		return $this->set('Memo', $memo);
	}
	
	public function getMemo()
	{
		return $this->get('Memo');
	}
	
	public function setIsToBePrinted()
	{
		
	}
	
	public function getIsToBePrinted()
	{
		
	}
	
	public function setIsToBeEmailed()
	{
		
	}
	
	public function getIsToBeEmailed()
	{
		
	}
	
	public function setVendorPurchaseTaxCodeListID()
	{
		
	}
	
	public function setVendorPurchaseTaxCodeName()
	{
		
	}
	
	public function getVendorPurchaseTaxCodeListID()
	{
		
	}
	
	public function getVendorPurchaseTaxCodeName()
	{
		
	}
	
	public function setLinkToTxnID($TxnID)
	{
		return $this->set('LinkToTxnID', $TxnID);
	}

	public function getLinkToTxnID()
	{
		return $this->get('LinkToTxnID');
	}
	
	/*
	public function getPurchaseOrderLines()
	{
		return $this->getList('PurchaseOrderLine');
	}
	
	public function getPurchaseOrderLine($which)
	{
		$list = $this->getPurchaseOrderLines();
		
		if (isset($list[$which]))
		{
			return $list[$which];
		}
		
		return null;
	}
	*/
	
	/*
	public function setPurchaseOrderLine($i, 
	{
		
	}
	*/
	
	/**
	 * 
	 * 
	 * @param 
	 */
	public function addPurchaseOrderLine($obj)
	{
		$lines = $this->get('PurchaseOrderLine');
		/*$lines[] = array(
			'Quantity' => mt_rand(4, 8), 
			'Amount' => mt_rand(255, 300), 
			'ItemRef ListID' => 'test', 
			);
		*/
		
		/*
		$tmp = new QuickBooks_Object_Generic();
		$tmp->set('Quantity', mt_rand(4, 8));
		$tmp->set('Amount', mt_rand(255, 300));
		$tmp->set('ItemRef ListID', 'test');
		$lines[] = $tmp;
		*/
		
		//
		$lines[] = $obj;
		
		return $this->set('PurchaseOrderLine', $lines);
	}
	
	public function setPurchaseOrderLine($i, $obj)
	{
		
	}
	
	public function setPurchaseOrderLineData($i, $key, $value)
	{
		$lines = $this->getPurchaseOrderLines();
		if (isset($lines[$i]))
		{
			
		}
		
		return $this->set('PurchaseOrderLine', $lines);
	}

	public function getPurchaseOrderLineData()
  {
    return $this->get('PurchaseOrderLine');
  }

	public function getPurchaseOrderLine()
	{
		
	}
	
	public function setOther($other)
	{
		return $this->set('Other', $other);
	}
	
	public function getOther()
	{
		return $this->get('Other');
	}
		
	/**
	 * 
	 * 
	 * @return boolean
	 */
	protected function _cleanup()
	{
		
		return true;
	}
	
	public function asList($request)
	{
		switch ($request)
		{
			case 'PurchaseOrderAddRq':
				
				if (isset($this->_object['PurchaseOrderLine']))
				{
					$this->_object['PurchaseOrderLineAdd'] = $this->_object['PurchaseOrderLine'];
				}
				
				break;
			case 'PurchaseOrderModRq':
				
				if (isset($this->_object['PurchaseOrderLine']))
				{
					$this->_object['PurchaseOrderLineMod'] = $this->_object['PurchaseOrderLine'];	
				}
				
				break;
		}
		
		return parent::asList($request);
	}
	
	public function asXML($root = null, $parent = null, $object = null)
	{
		if (is_null($object))
		{
			$object = $this->_object;
		}
		
		switch ($root)
		{
			case QUICKBOOKS_ADD_PURCHASEORDER:
				
				//if (isset($this->_object['PurchaseOrderLine']))
				//{
				//	$this->_object['PurchaseOrderLineAdd'] = $this->_object['PurchaseOrderLine'];
				//}
				
				foreach ($object['PurchaseOrderLineAdd'] as $key => $obj)
				{
					$obj->setOverride('PurchaseOrderLineAdd');
				}
				
				break;
			case QUICKBOOKS_MOD_PURCHASEORDER:
				if (isset($object['PurchaseOrderLine']))
				{
					$object['PurchaseOrderLineMod'] = $object['PurchaseOrderLine'];
				}
				break;
		}
		
		//print_r($this->_object);
		
		return parent::asXML($root, $parent, $object);
	}
	
	/**
	 * 
	 */
	public function asArray($request, $nest = true)
	{
		$this->_cleanup();
		
		return parent::asArray($request, $nest);
	}
	
	/**
	 * 
	 * 
	 * @param boolean $todo_for_empty_elements	A constant, one of: QUICKBOOKS_XML_XML_COMPRESS, QUICKBOOKS_XML_XML_DROP, QUICKBOOKS_XML_XML_PRESERVE
	 * @param string $indent
	 * @param string $root
	 * @return string
	 */
	public function asQBXML($request, $todo_for_empty_elements = QUICKBOOKS_OBJECT_XML_DROP, $indent = "\t", $root = null, $parent = null)
	{
		$this->_cleanup();
		
		return parent::asQBXML($request, $todo_for_empty_elements, $indent, $root);
	}
	
	/**
	 * Tell the type of object this is
	 * 
	 * @return string
	 */
	public function object()
	{
		return QUICKBOOKS_OBJECT_PURCHASEORDER;
	}
}
