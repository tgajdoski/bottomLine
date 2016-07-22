<?php
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);

if (function_exists('date_default_timezone_set'))
{
	date_default_timezone_set('America/New_York');
}

require_once 'QuickBooks.php';

$user = 'qbffi';
$pass = 'qbffi';
$company_file = 'C:\\FFI Data\\Quickbooks\\Intuit\\QuickBooks\\Company Files\\firmfound.QBW';

$map = array(
	QUICKBOOKS_MOD_SALESORDER => array( '_quickbooks_salesorder_mod_request', '_quickbooks_salesorder_mod_response' ),
	QUICKBOOKS_QUERY_SALESORDER => array( '_quickbooks_salesorder_query_request', '_quickbooks_salesorder_query_response' ),
	QUICKBOOKS_ADD_SALESORDER => array( '_quickbooks_salesorder_add_request', '_quickbooks_salesorder_add_response' ),
	QUICKBOOKS_QUERY_CUSTOMER => array( '_quickbooks_customer_query_request', '_quickbooks_customer_query_response' ),
	QUICKBOOKS_QUERY_SERVICEITEM => array( '_quickbooks_serviceitem_query_request', '_quickbooks_serviceitem_query_response' ),
	QUICKBOOKS_MOD_PURCHASEORDER => array( '_quickbooks_purchaseorder_mod_request', '_quickbooks_purchaseorder_mod_response' ),
	QUICKBOOKS_QUERY_PURCHASEORDER => array( '_quickbooks_purchaseorder_query_request', '_quickbooks_purchaseorder_query_response' ),
	QUICKBOOKS_ADD_PURCHASEORDER => array( '_quickbooks_purchaseorder_add_request', '_quickbooks_purchaseorder_add_response' ),
	QUICKBOOKS_QUERY_VENDOR => array( '_quickbooks_vendor_query_request', '_quickbooks_vendor_query_response' ),
	QUICKBOOKS_ADD_TIMETRACKING => array( '_quickbooks_timetracking_add_request', '_quickbooks_timetracking_add_response' ),
	QUICKBOOKS_QUERY_EMPLOYEE => array( '_quickbooks_employee_query_request', '_quickbooks_employee_query_response' ),
	"QUICKBOOKS_UPDATE_FFI" => array( '_quickbooks_ffi_update_request', '_quickbooks_ffi_update_response' ),
	QUICKBOOKS_ADD_CUSTOMER => array( '_quickbooks_customer_add_request', '_quickbooks_customer_add_response' ),
	QUICKBOOKS_ADD_VENDOR => array( '_quickbooks_vendor_add_request', '_quickbooks_vendor_add_response' ),
	QUICKBOOKS_ADD_SERVICEITEM => array( '_quickbooks_serviceitem_add_request', '_quickbooks_serviceitem_add_response' ),
	);

$errmap = array(
	QUICKBOOKS_QUERY_SALESORDER => '_quickbooks_error_salesorderquery',
	QUICKBOOKS_QUERY_PURCHASEORDER => '_quickbooks_error_purchaseorderquery',
	QUICKBOOKS_QUERY_EMPLOYEE => '_quickbooks_error_employeequery',
	QUICKBOOKS_QUERY_CUSTOMER => '_quickbooks_error_customerquery',
	3100 => '_quickbooks_error_namenotunique',
	3130 => '_quickbooks_error_parentrefnotfound',
	3200 => '_quickbooks_error_outdatededitsequence',
	'*' => '_quickbooks_error_catchall',
	);

$hooks = array(
	);

$log_level = QUICKBOOKS_LOG_DEBUG;				

$soapserver = QUICKBOOKS_SOAPSERVER_BUILTIN;		// A pure-PHP SOAP server (no PHP ext/soap extension required, also makes debugging easier)

$soap_options = array(		// See http://www.php.net/soap
	);

$handler_options = array(
	'deny_concurrent_logins' => false, 
	'deny_reallyfast_logins' => false, 
	);		// See the comments in the QuickBooks/Server/Handlers.php file

$driver_options = array(		// See the comments in the QuickBooks/Driver/<YOUR DRIVER HERE>.php file ( i.e. 'Mysql.php', etc. )
	);

$callback_options = array(
	);

$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';

if (!QuickBooks_Utilities::initialized($dsn))
{
	QuickBooks_Utilities::initialize($dsn);
	
	QuickBooks_Utilities::createUser($dsn, $user, $pass, $company_file);
}

$Server = new QuickBooks_WebConnector_Server($dsn, $map, $errmap, $hooks, $log_level, $soapserver, QUICKBOOKS_WSDL, $soap_options, $handler_options, $driver_options, $callback_options);
$response = $Server->handle(true, true);

function initDB()
{
	$link = mysql_connect('localhost', 'ffi', 'Firm2825');
	if (!$link) 
	{
		die('Could not connect to MySQL: ' . mysql_error());
	}

	$selected = mysql_select_db('app', $link);
	if (!$selected) 
	{
		die ('Could not select database: ' . mysql_error());
	}
}

function deQueue($action, $id)
{
	$link = mysql_connect('localhost', 'ffi', 'Firm2825');
	if (!$link) 
	{
		die('Could not connect to MySQL: ' . mysql_error());
	}

	$selected = mysql_select_db('qbffi', $link);
	if (!$selected) 
	{
		die ('Could not select database: ' . mysql_error());
	}
	
	mysql_query("UPDATE quickbooks_queue SET qb_status = 's' WHERE qb_status = 'q' AND qb_action = '" . $action . "' AND ident = '" . $id . "'");

	$selected = mysql_select_db('app', $link);
	if (!$selected) 
	{
		die ('Could not select database: ' . mysql_error());
	}
}


function _quickbooks_salesorder_mod_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';

	$extra = array();
	$extra["action"] = $action;
	
	initDB();
	
	$saleitems    = mysql_query("SELECT job_id, name, quantity, rate, qb_txnid, qb_editsequence, qb_txnlineid FROM saleitem WHERE id = " . (int) $ID);
	if ($saleitems && mysql_num_rows($saleitems) == 1)
	{
		$saleitem = mysql_fetch_array($saleitems);
		$job      = mysql_fetch_array(mysql_query("SELECT item_id, qb_listid, qb_txnlineid FROM job WHERE id = " . (int) $saleitem["job_id"]));
		$item     = mysql_fetch_array(mysql_query("SELECT qb_listid FROM item WHERE id = " . (int) $job["item_id"]));
		if (is_null($job["qb_listid"])) {
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else if (is_null($item["qb_listid"]))
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_SERVICEITEM, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else if (is_null($saleitem["qb_txnid"]) || $saleitem["qb_txnid"] == "")
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_SALESORDER, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else
		{
			$xml .= '<SalesOrderModRq>
<SalesOrderMod>
<TxnID>'.$saleitem["qb_txnid"].'</TxnID>
<EditSequence>'.$saleitem["qb_editsequence"].'</EditSequence>
<CustomerRef><ListID>'.$job["qb_listid"].'</ListID></CustomerRef>
';

			if (!is_null($job["qb_txnlineid"]) && $job["qb_txnlineid"] != "")
			{
				$xml .= '<SalesOrderLineMod><TxnLineID>'.$job["qb_txnlineid"].'</TxnLineID></SalesOrderLineMod>
';
			}
			
			$newlines = "";
			$lines = mysql_query("SELECT name, quantity, rate, qb_refnumber, qb_txnlineid FROM saleitem WHERE job_id = ".$saleitem["job_id"]." ORDER BY qb_txnlineid");
			while ($line = mysql_fetch_array($lines))
			{
				if ($line["qb_txnlineid"] == "-1" && ($line["qb_refnumber"] == "..." || $line["qb_refnumber"] == "ERR"))
				{
					$newlines .= '<SalesOrderLineMod>
<TxnLineID>'.$line["qb_txnlineid"].'</TxnLineID>
<ItemRef>
<ListID>'.$item["qb_listid"].'</ListID>
</ItemRef>
<Desc>'.trim($line["name"]).'</Desc>
<Quantity>'.$line["quantity"].'</Quantity>
<Rate>'.$line["rate"].'</Rate>
</SalesOrderLineMod>
';
				}
				else if ($line["qb_refnumber"] != "..." && !is_null($line["qb_txnlineid"]) && $line["qb_txnlineid"] != "" && $line["qb_txnlineid"] != "-1")
				{
					$xml .= '<SalesOrderLineMod><TxnLineID>'.$line["qb_txnlineid"].'</TxnLineID></SalesOrderLineMod>
';
				}
				else if ($line["qb_refnumber"] == "..." || $line["qb_refnumber"] == "ERR")
				{
					$xml .= '<SalesOrderLineMod>
<TxnLineID>'.$line["qb_txnlineid"].'</TxnLineID>
<ItemRef>
<ListID>'.$item["qb_listid"].'</ListID>
</ItemRef>
<Desc>'.trim($line["name"]).'</Desc>
<Quantity>'.$line["quantity"].'</Quantity>
<Rate>'.$line["rate"].'</Rate>
</SalesOrderLineMod>
';
				}
			}
			$xml .= $newlines . '</SalesOrderMod>
</SalesOrderModRq>
';
		}
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);

	return $xml;
}

function _quickbooks_salesorder_mod_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$SalesOrder = $Root->getChildAt('QBXML QBXMLMsgsRs SalesOrderModRs SalesOrderRet');
		if ($SalesOrder)
		{
			$qb_refnumber = "ERR";
			
			initDB();
			$saleitem   = mysql_fetch_array(mysql_query("SELECT job_id, name FROM saleitem WHERE id = " . (int) $ID));
			foreach ($SalesOrder->children() as $Child)
			{
				if ($Child->name() == 'SalesOrderLineRet')
				{
					$query = mysql_query("SELECT id, name FROM saleitem WHERE job_id = " . (int) $saleitem["job_id"] . " AND name LIKE \"%" .mysql_real_escape_string($Child->getChildDataAt('SalesOrderLineRet Desc')). "%\"");
					while ($line = mysql_fetch_array($query))
					{
						if (htmlspecialchars_decode($Child->getChildDataAt('SalesOrderLineRet Desc')) == trim($line["name"]))
						{
							if ($ID == (string) $line["id"])
							{
								$qb_refnumber = $SalesOrder->getChildDataAt('SalesOrderRet RefNumber');
							}
							else
							{
								deQueue($action, $line["id"]);
							}
							
							mysql_query("UPDATE saleitem SET qb_txnlineid = '" . $Child->getChildDataAt('SalesOrderLineRet TxnLineID') . "' WHERE id = " . (int) $line["id"]);
							
							break;
						}
					}
				}
			}
			
			mysql_query("UPDATE saleitem SET qb_txnid = '" . $SalesOrder->getChildDataAt('SalesOrderRet TxnID') . "', qb_editsequence = '" . $SalesOrder->getChildDataAt('SalesOrderRet EditSequence') . "' WHERE job_id = " . (int) $saleitem["job_id"]);
			
			mysql_query("UPDATE saleitem SET qb_refnumber = '" . $qb_refnumber . "' WHERE job_id = ".$saleitem["job_id"]." AND qb_txnlineid IS NOT NULL AND qb_txnlineid != '' AND qb_txnlineid != '-1'");
		}
		else if ($Root->getChildAt('QBXML QBXMLMsgsRs HostQueryRs HostQuery') === false)
		{
			initDB();
			mysql_query("UPDATE saleitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
}

function _quickbooks_salesorder_query_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	if (is_array($extra) && array_key_exists("action", $extra) && $extra["action"] == QUICKBOOKS_MOD_SALESORDER)
	{
		initDB();
		
		$saleitem    = mysql_fetch_array(mysql_query("SELECT job_id FROM saleitem WHERE id = " . (int) $ID));
		$job         = mysql_fetch_array(mysql_query("SELECT qb_listid FROM job WHERE id = " . (int) $saleitem["job_id"]));
		if (is_null($job["qb_listid"])) {
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else
		{
			$xml .= '<SalesOrderQueryRq>
<EntityFilter><ListID>'.$job["qb_listid"].'</ListID></EntityFilter>
</SalesOrderQueryRq>
';
		}
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);

	return $xml;
}

function _quickbooks_salesorder_query_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$SalesOrder = $Root->getChildAt('QBXML QBXMLMsgsRs SalesOrderQueryRs SalesOrderRet');
		if ($SalesOrder && is_array($extra) && array_key_exists("action", $extra))
		{
			initDB();
			$saleitem   = mysql_fetch_array(mysql_query("SELECT job_id FROM saleitem WHERE id = " . (int) $ID));
			mysql_query("UPDATE saleitem SET qb_txnid = '" . $SalesOrder->getChildDataAt('SalesOrderRet TxnID') . "', qb_editsequence = '" . $SalesOrder->getChildDataAt('SalesOrderRet EditSequence') . "' WHERE job_id = " . (int) $saleitem["job_id"]);
			
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue($extra["action"], $ID, 1, $extra);
		}
		else if ($Root->getChildAt('QBXML QBXMLMsgsRs HostQueryRs HostQuery') === false)
		{
			initDB();
			mysql_query("UPDATE saleitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
}

function _quickbooks_error_salesorderquery($requestID, $user, $action, $ID, $extra, &$err, $xml, $errnum, $errmsg)
{
	$fh = fopen('http-error.txt', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, "RequestID: ".$requestID."\n\nUser: ".$user."\n\nAction: ".$action."\n\nID: ".$ID."\n\nExtra: ".json_encode($extra)."\n\nErr: ".$err."\n\nXML: ".$xml."\n\nErrnum: ".$errnum."\n\nErrmsg: ".$errmsg);
	fclose($fh);

	$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
	$Queue = new QuickBooks_WebConnector_Queue($dsn);
	$Queue->enqueue(QUICKBOOKS_ADD_SALESORDER, $ID, 1, $extra);
	
	return true;
}

function _quickbooks_salesorder_add_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	if (is_array($extra) && array_key_exists("action", $extra) && $extra["action"] == QUICKBOOKS_MOD_SALESORDER)
	{
		$SalesOrder = new QuickBooks_QBXML_Object_SalesOrder();
		
		initDB();
		
		$saleitem    = mysql_fetch_array(mysql_query("SELECT job_id FROM saleitem WHERE id = " . (int) $ID));
		$job         = mysql_fetch_array(mysql_query("SELECT market_id, subdivision_id, item_id, lot, qb_listid FROM job WHERE id = " . (int) $saleitem["job_id"]));
		$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id, name FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
		$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		$market      = mysql_fetch_array(mysql_query("SELECT city, state FROM market WHERE id = " . (int) $job["market_id"]));
		$item        = mysql_fetch_array(mysql_query("SELECT name FROM item WHERE id = " . (int) $job["item_id"]));
		
		$SalesOrder->setCustomerListID($job["qb_listid"]);
		$SalesOrder->setClassName($market["city"].", ".$market["state"]);
		
		$Line1 = new QuickBooks_QBXML_Object_SalesOrder_SalesOrderLine();
		$Line1->setDescription($customer["name"] . ":" . $subdivision["name"] . ":Lot " . $job["lot"] . " " . $item["name"]);

		$SalesOrder->addSalesOrderLine($Line1);
		
		$xml .= $SalesOrder->asQBXML(QUICKBOOKS_ADD_SALESORDER, null, QUICKBOOKS_LOCALE_UNITED_STATES);
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);

	return $xml;
}

function _quickbooks_salesorder_add_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$SalesOrder = $Root->getChildAt('QBXML QBXMLMsgsRs SalesOrderAddRs SalesOrderRet');
		if ($SalesOrder && is_array($extra) && array_key_exists("action", $extra))
		{
			initDB();
			$saleitem   = mysql_fetch_array(mysql_query("SELECT job_id FROM saleitem WHERE id = " . (int) $ID));
			mysql_query("UPDATE saleitem SET qb_txnid = '" . $SalesOrder->getChildDataAt('SalesOrderRet TxnID') . "', qb_editsequence = '" . $SalesOrder->getChildDataAt('SalesOrderRet EditSequence') . "' WHERE job_id = " . (int) $saleitem["job_id"]);
			mysql_query("UPDATE job SET qb_txnlineid = '" . $SalesOrder->getChildDataAt('SalesOrderRet SalesOrderLineRet TxnLineID') . "' WHERE id = " . (int) $saleitem["job_id"]);
			
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue($extra["action"], $ID, 1, $extra);
		}
		else if ($Root->getChildAt('QBXML QBXMLMsgsRs HostQueryRs HostQuery') === false)
		{
			initDB();
			mysql_query("UPDATE saleitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
}

function _quickbooks_customer_query_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';

	$name = "";
	
	initDB();
	
	if (is_array($extra) && array_key_exists("action", $extra))
	{
		if ($extra["action"] == QUICKBOOKS_MOD_SALESORDER)
		{
			$saleitem    = mysql_fetch_array(mysql_query("SELECT job_id FROM saleitem WHERE id = " . (int) $ID));
			$job         = mysql_fetch_array(mysql_query("SELECT id, lot, subdivision_id FROM job WHERE id = " . (int) $saleitem["job_id"]));
		}
		else if ($extra["action"] == QUICKBOOKS_ADD_TIMETRACKING)
		{
			$lineitem    = mysql_fetch_array(mysql_query("SELECT job_id FROM lineitem WHERE id = " . (int) $ID));
			$job         = mysql_fetch_array(mysql_query("SELECT id, lot, subdivision_id FROM job WHERE id = " . (int) $lineitem["job_id"]));
		}
		$subdivision = mysql_fetch_array(mysql_query("SELECT name, customer_id FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
		$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		
		$name        = preg_replace('/\s?\(.*?\)\s?/','',trim($customer["name"]));
		$name        .= ":".preg_replace('/\s?\(.*?\)\s?/','',trim($subdivision["name"]));
		$name        .= ":".$job["id"]." Lot ".preg_replace('/\s?\(.*?\)\s?/','',trim($job["lot"]));
	}
	else if (strpos($extra,"customer") === 0)
	{
		if (strpos($extra,"job") !== false)
		{
			$job         = mysql_fetch_array(mysql_query("SELECT subdivision_id FROM job WHERE id = " . (int) $ID));
			$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
			$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		}
		else if (strpos($extra,"subdivision") !== false)
		{
			$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id FROM subdivision WHERE id = " . (int) $ID));
			$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		}
		else
		{
			$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $ID));
		}
		$name = preg_replace('/\s?\(.*?\)\s?/','',$customer["name"]);
	}
	else if (strpos($extra,"subdivision") === 0)
	{
		if (strpos($extra,"job") !== false)
		{
			$job         = mysql_fetch_array(mysql_query("SELECT subdivision_id FROM job WHERE id = " . (int) $ID));
			$subdivision = mysql_fetch_array(mysql_query("SELECT id, customer_id, name FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
		}
		else
		{
			$subdivision = mysql_fetch_array(mysql_query("SELECT id, customer_id, name FROM subdivision WHERE id = " . (int) $ID));
		}
		$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		$name        = preg_replace('/\s?\(.*?\)\s?/','',trim($customer["name"]));
		$name        .= ":".preg_replace('/\s?\(.*?\)\s?/','',trim($subdivision["name"]));
	}
	else if ($extra == "job")
	{
		$job         = mysql_fetch_array(mysql_query("SELECT id, subdivision_id, lot FROM job WHERE id = " . (int) $ID));
		$subdivision = mysql_fetch_array(mysql_query("SELECT id, customer_id, name FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
		$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		$name        = preg_replace('/\s?\(.*?\)\s?/','',trim($customer["name"]));
		$name        .= ":".preg_replace('/\s?\(.*?\)\s?/','',trim($subdivision["name"]));
		$name        .= ":".$job["id"]." Lot ".preg_replace('/\s?\(.*?\)\s?/','',trim($job["lot"]));
	}
	
	$xml .= '<CustomerQueryRq>
<FullName>'.htmlspecialchars($name).'</FullName>
</CustomerQueryRq>
';
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';

	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	return $xml;
}

function _quickbooks_customer_query_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$Customer = $Root->getChildAt('QBXML QBXMLMsgsRs CustomerQueryRs CustomerRet');
		if ($Customer)
		{
			initDB();
			
			if (is_array($extra) && array_key_exists("action", $extra))
			{
				$id = 0;
				if ($extra["action"] == QUICKBOOKS_MOD_SALESORDER)
				{
					$saleitem = mysql_fetch_array(mysql_query("SELECT job_id FROM saleitem WHERE id = " . (int) $ID));
					$id       = $saleitem["job_id"];
				}
				else if ($extra["action"] == QUICKBOOKS_ADD_TIMETRACKING)
				{
					$lineitem = mysql_fetch_array(mysql_query("SELECT job_id FROM lineitem WHERE id = " . (int) $ID));
					$id       = $lineitem["job_id"];
				}
				if ($id > 0)
				{
					mysql_query("UPDATE job SET qb_listid = '".$Customer->getChildDataAt('CustomerRet ListID')."' WHERE id = " . (int) $id);
				}
				
				$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
				$Queue = new QuickBooks_WebConnector_Queue($dsn);
				if ($extra["action"] == QUICKBOOKS_MOD_SALESORDER)
				{
					$Queue->enqueue(QUICKBOOKS_QUERY_SALESORDER, $ID, 1, $extra);
				}
				else
				{
					$Queue->enqueue($extra["action"], $ID, 1, $extra);
				}
			}
			else if (strpos($extra,"customer") !== false || strpos($extra,"subdivision") !== false || $extra == "job")
			{
				$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
				$Queue = new QuickBooks_WebConnector_Queue($dsn);
				if (strpos($extra,"customer") === 0)
				{
					if (strpos($extra,"job") !== false)
					{
						$job         = mysql_fetch_array(mysql_query("SELECT subdivision_id FROM job WHERE id = " . (int) $ID));
						$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
						$id          = $subdivision["customer_id"];
					}
					else if (strpos($extra,"subdivision") !== false)
					{
						$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id FROM subdivision WHERE id = " . (int) $ID));
						$id          = $subdivision["customer_id"];
					}
					else
					{
						$id          = $ID;
					}
					mysql_query("UPDATE customer SET qb_listid = '".$Customer->getChildDataAt('CustomerRet ListID')."' WHERE id = " . (int) $id);
					if (mysql_affected_rows() > 0)
					{
						$extra = str_replace("customer", "", $extra);
						if ($extra == "")
						{
							$subdivisions = mysql_query("SELECT id FROM subdivision WHERE customer_id = " . (int) $ID);
							while ($subdivision = mysql_fetch_array($subdivisions))
							{
								$Queue->enqueue(QUICKBOOKS_ADD_CUSTOMER, $subdivision["id"], 0, "subdivision");
							}
						}
						else
						{
							$Queue->enqueue(QUICKBOOKS_ADD_CUSTOMER, $ID, 2, $extra);
						}
					}
				}
				else if (strpos($extra,"subdivision") === 0)
				{
					if (strpos($extra,"job") !== false)
					{
						$job         = mysql_fetch_array(mysql_query("SELECT subdivision_id FROM job WHERE id = " . (int) $ID));
						$id          = $job["subdivision_id"];
					}
					else
					{
						$id          = $ID;
					}
					mysql_query("UPDATE subdivision SET qb_listid = '".$Customer->getChildDataAt('CustomerRet ListID')."' WHERE id = " . (int) $id);
					if (mysql_affected_rows() > 0)
					{
						$extra = str_replace("subdivision", "", $extra);
						if ($extra == "")
						{
							$jobs = mysql_query("SELECT id FROM job WHERE subdivision_id = " . (int) $ID);
							while ($job = mysql_fetch_array($jobs))
							{
								$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $job["id"], 0, "job");
							}
						}
						else
						{
							$Queue->enqueue(QUICKBOOKS_ADD_CUSTOMER, $ID, 2, $extra);
						}
					}
				}
				else if ($extra == "job")
				{
					mysql_query("UPDATE job SET qb_listid = '".$Customer->getChildDataAt('CustomerRet ListID')."' WHERE id = " . (int) $ID);
					if (mysql_affected_rows() > 0)
					{
						$saleitems = mysql_query("SELECT id FROM saleitem WHERE job_id = ".$ID." AND qb_refnumber != '...' AND qb_txnlineid IS NOT NULL AND qb_txnlineid != '' AND qb_txnlineid != '-1' LIMIT 1");
						if ($saleitems && mysql_num_rows($saleitems))
						{
							$saleitem = mysql_fetch_array($saleitems);
							$Queue->enqueue(QUICKBOOKS_MOD_SALESORDER, $saleitem["id"], 0, null);
						}
						
						$lineitems = mysql_query("SELECT id FROM lineitem WHERE task_type_id IS NOT NULL AND item_type_id = 1 AND job_id = ".$ID." AND qb_refnumber = '&#10004;'");
						if ($lineitems && mysql_num_rows($lineitems))
						{
							$lineitem = mysql_fetch_array($lineitems);
							$Queue->enqueue(QUICKBOOKS_ADD_TIMETRACKING, $lineitem["id"], 0, null);
						}
					}
				}
			}
		}
	}
}

function _quickbooks_error_customerquery($requestID, $user, $action, $ID, $extra, &$err, $xml, $errnum, $errmsg)
{
	$fh = fopen('http-error.txt', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, "RequestID: ".$requestID."\n\nUser: ".$user."\n\nAction: ".$action."\n\nID: ".$ID."\n\nExtra: ".json_encode($extra)."\n\nErr: ".$err."\n\nXML: ".$xml."\n\nErrnum: ".$errnum."\n\nErrmsg: ".$errmsg);
	fclose($fh);
	
	if (is_array($extra) && array_key_exists("action", $extra))
	{
		initDB();
		if ($extra["action"] == QUICKBOOKS_MOD_PURCHASEORDER || $extra["action"] == QUICKBOOKS_ADD_TIMETRACKING)
		{
			mysql_query("UPDATE lineitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
		else if ($extra["action"] == QUICKBOOKS_MOD_SALESORDER)
		{
			mysql_query("UPDATE saleitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
	else if (strpos($extra,"subdivision") !== false && $extra != "subdivision")
	{
		initDB();
		
		$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
		$Queue = new QuickBooks_WebConnector_Queue($dsn);
		$Queue->enqueue(QUICKBOOKS_ADD_CUSTOMER, $ID, 2, $extra);
	}
	
	return true;
}

function _quickbooks_serviceitem_query_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	$name = "";
	
	initDB();
	
	if (is_array($extra) && array_key_exists("action", $extra))
	{
		if ($extra["action"] == QUICKBOOKS_MOD_SALESORDER)
		{
			$saleitem    = mysql_fetch_array(mysql_query("SELECT job_id FROM saleitem WHERE id = " . (int) $ID));
			$job         = mysql_fetch_array(mysql_query("SELECT item_id FROM job WHERE id = " . (int) $saleitem["job_id"]));
			$items       = mysql_query("SELECT name FROM item WHERE id = " . (int) $job["item_id"]);
			if ($items && mysql_num_rows($items) == 1)
			{
				$item    = mysql_fetch_array($items);
				$name    = "Sale Items:".trim($item["name"]);
			}
			else
			{
				$name    = "Sale Items:Misc. Sales";
			}
		}
		else if ($extra["action"] == QUICKBOOKS_MOD_PURCHASEORDER)
		{
			$lineitem    = mysql_fetch_array(mysql_query("SELECT item_id FROM lineitem WHERE id = " . (int) $ID));
			$item        = mysql_fetch_array(mysql_query("SELECT name FROM item WHERE id = " . (int) $lineitem["item_id"]));
			
			if (count(explode(":", $item["name"])) == 2)
			{
				$parts = explode(":", $item["name"]);
				$name  = "Materials:".implode(":", array(trim($parts[0]), trim($parts[1])));
			}
			else
			{
				$name = "Materials:".trim($item["name"]);
			}
		}
		else if ($extra["action"] == QUICKBOOKS_ADD_TIMETRACKING)
		{
			$lineitem    = mysql_fetch_array(mysql_query("SELECT vendor_id, item_id FROM lineitem WHERE id = " . (int) $ID));
			$vendor      = mysql_fetch_array(mysql_query("SELECT name FROM vendor WHERE id = " . (int) $lineitem["vendor_id"]));
			$item        = mysql_fetch_array(mysql_query("SELECT name FROM item WHERE id = " . (int) $lineitem["item_id"]));
			$name = "Subcontract/Employee/Labor:".preg_replace('/\s?\(.*?\)\s?/','',$vendor["name"]);
			
			if ($item["name"] != "Hourly Per Man" && !array_key_exists("parent", $extra))
			{
				$name .= ":".trim($item["name"]);
			}
		}
	}
	else if ($extra == "vendor_item" || $extra == "item")
	{
		if ($extra == "vendor_item")
		{
			$vendorItem  = mysql_fetch_array(mysql_query("SELECT id, vendor_id, item_id FROM vendor_item WHERE id = " . (int) $ID));
			$vendor      = mysql_fetch_array(mysql_query("SELECT name FROM vendor WHERE id = " . (int) $vendorItem["vendor_id"]));
			$item        = mysql_fetch_array(mysql_query("SELECT item_type_id, name FROM item WHERE id = " . (int) $vendorItem["item_id"]));
		}
		else
		{
			$item        = mysql_fetch_array(mysql_query("SELECT item_type_id, name FROM item WHERE id = " . (int) $ID));
		}
		$type        = mysql_fetch_array(mysql_query("SELECT name FROM item_type WHERE id = " . (int) $item["item_type_id"]));
		
		if ($type["name"] == "labor")
		{
			$name = "Subcontract/Employee/Labor:".preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
			
			if ($item["name"] != "Hourly Per Man")
			{
				$name .= ":".trim($item["name"]);
			}
		}
		else if ($type["name"] == "sale")
		{
			$name = "Sale Items:".trim($item["name"]);
		}
		else if (count(explode(":", $item["name"])) == 2)
		{
			$parts = explode(":", $item["name"]);
			$name  = "Materials:".implode(":", array(trim($parts[0]), trim($parts[1])));
		}
		else
		{
			$name = "Materials:".trim($item["name"]);
		}
	}
			
	$xml .= '<ItemServiceQueryRq>
<FullName>'.htmlspecialchars($name).'</FullName>
</ItemServiceQueryRq>
';
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';

	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	return $xml;
}

function _quickbooks_serviceitem_query_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$ServiceItem = $Root->getChildAt('QBXML QBXMLMsgsRs ItemServiceQueryRs ItemServiceRet');
		if ($ServiceItem)
		{
			initDB();
			
			if (is_array($extra) && array_key_exists("action", $extra))
			{
				if ($extra["action"] == QUICKBOOKS_MOD_SALESORDER)
				{
					$saleitem = mysql_fetch_array(mysql_query("SELECT job_id FROM saleitem WHERE id = " . (int) $ID));
					$job      = mysql_fetch_array(mysql_query("SELECT item_id FROM job WHERE id = " . (int) $saleitem["job_id"]));
					mysql_query("UPDATE item SET qb_listid = '".$ServiceItem->getChildDataAt('ItemServiceRet ListID')."' WHERE id = " . (int) $job["item_id"]);
				}
				else if ($extra["action"] == QUICKBOOKS_MOD_PURCHASEORDER)
				{
					$lineitem = mysql_fetch_array(mysql_query("SELECT item_id FROM lineitem WHERE id = " . (int) $ID));
					mysql_query("UPDATE item SET qb_listid = '".$ServiceItem->getChildDataAt('ItemServiceRet ListID')."' WHERE id = " . (int) $lineitem["item_id"]);
				}
				else if ($extra["action"] == QUICKBOOKS_ADD_TIMETRACKING)
				{
					$lineitem = mysql_fetch_array(mysql_query("SELECT job_id, vendor_id, item_id, task_id, quantity FROM lineitem WHERE id = " . (int) $ID));
					mysql_query("UPDATE vendor_item SET qb_listid = '".$ServiceItem->getChildDataAt('ItemServiceRet ListID')."' WHERE vendor_id = " . (int) $lineitem["vendor_id"] . " AND item_id = " . (int) $lineitem["item_id"]);
				}
				
				$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
				$Queue = new QuickBooks_WebConnector_Queue($dsn);
				$Queue->enqueue($extra["action"], $ID, 1, $extra);
			}
			else if ($extra == "vendor_item" || $extra == "item")
			{
				mysql_query("UPDATE ".$extra." SET qb_listid = '".$ServiceItem->getChildDataAt('ItemServiceRet ListID')."' WHERE id = " . (int) $ID);
			}
		}
	}
}

function _quickbooks_purchaseorder_mod_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	$extra = array();
	$extra["action"] = $action;
	
	initDB();
	
	$lineitems    = mysql_query("SELECT job_id, vendor_id, task_id, item_id, quantity, rate, notes, qb_txnid, qb_editsequence, qb_txnlineid FROM lineitem WHERE id = " . (int) $ID);
	if ($lineitems && mysql_num_rows($lineitems) == 1)
	{
		$lineitem    = mysql_fetch_array($lineitems);
		$vendor      = mysql_fetch_array(mysql_query("SELECT qb_listid FROM vendor WHERE id = " . (int) $lineitem["vendor_id"]));
		$item        = mysql_fetch_array(mysql_query("SELECT name, qb_listid FROM item WHERE id = " . (int) $lineitem["item_id"]));
		$job         = mysql_fetch_array(mysql_query("SELECT market_id, subdivision_id, item_id, lot FROM job WHERE id = " . (int) $lineitem["job_id"]));
		$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id, name FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
		$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		$market      = mysql_fetch_array(mysql_query("SELECT city, state FROM market WHERE id = " . (int) $job["market_id"]));
		$saleitem    = mysql_fetch_array(mysql_query("SELECT name FROM item WHERE id = " . (int) $job["item_id"]));
		$task        = mysql_fetch_array(mysql_query("SELECT date FROM task WHERE id = " . (int) $lineitem["task_id"]));
		if (is_null($vendor["qb_listid"])) {
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_VENDOR, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else if (is_null($item["qb_listid"]))
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_SERVICEITEM, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else if (is_null($lineitem["qb_txnid"]) || $lineitem["qb_txnid"] == "")
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_PURCHASEORDER, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else
		{
			$date = explode(" ",$task["date"]);
			
			$xml .= '<PurchaseOrderModRq>
<PurchaseOrderMod>
<TxnID>'.$lineitem["qb_txnid"].'</TxnID>
<EditSequence>'.$lineitem["qb_editsequence"].'</EditSequence>
<VendorRef><ListID>'.$vendor["qb_listid"].'</ListID></VendorRef>
<ClassRef><FullName>'.$market["city"].", ".$market["state"].'</FullName></ClassRef>
<TxnDate>'.$date[0].'</TxnDate>
<Memo>'.$customer["name"] . ":" . $subdivision["name"] . ":Lot " . $job["lot"] . " " . $saleitem["name"].'</Memo>
';

			$newlines = "";
			$lines = mysql_query("SELECT item_id, quantity, rate, notes, qb_refnumber, qb_txnlineid FROM lineitem WHERE job_id = ".$lineitem["job_id"]." AND vendor_id = ".$lineitem["vendor_id"]." AND task_id = ".$lineitem["task_id"]." ORDER BY qb_txnlineid");
			while ($line = mysql_fetch_array($lines))
			{
				$item = mysql_fetch_array(mysql_query("SELECT name, qb_listid FROM item WHERE id = " . (int) $line["item_id"]));
				$name = ($line["notes"]!="")?$line["notes"]:$item["name"];
				if ($line["qb_txnlineid"] == "-1" && ($line["qb_refnumber"] == "..." || $line["qb_refnumber"] == "ERR"))
				{
					$newlines .= '<PurchaseOrderLineMod>
<TxnLineID>'.$line["qb_txnlineid"].'</TxnLineID>
<ItemRef>
<ListID>'.$item["qb_listid"].'</ListID>
</ItemRef>
<Desc>'.trim($name).'</Desc>
<Quantity>'.$line["quantity"].'</Quantity>
<Rate>'.$line["rate"].'</Rate>
</PurchaseOrderLineMod>
';
				}
				else if ($line["qb_refnumber"] != "..." && !is_null($line["qb_txnlineid"]) && $line["qb_txnlineid"] != "" && $line["qb_txnlineid"] != "-1")
				{
					$xml .= '<PurchaseOrderLineMod><TxnLineID>'.$line["qb_txnlineid"].'</TxnLineID></PurchaseOrderLineMod>
';
				}
				else if ($line["qb_refnumber"] == "..." || $line["qb_refnumber"] == "ERR")
				{
					$xml .= '<PurchaseOrderLineMod>
<TxnLineID>'.$line["qb_txnlineid"].'</TxnLineID>
<ItemRef>
<ListID>'.$item["qb_listid"].'</ListID>
</ItemRef>
<Desc>'.trim($name).'</Desc>
<Quantity>'.$line["quantity"].'</Quantity>
<Rate>'.$line["rate"].'</Rate>
</PurchaseOrderLineMod>
';
				}
			}
			$xml .= $newlines . '</PurchaseOrderMod>
</PurchaseOrderModRq>
';
		}
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);

	return $xml;
}

function _quickbooks_purchaseorder_mod_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$PurchaseOrder = $Root->getChildAt('QBXML QBXMLMsgsRs PurchaseOrderModRs PurchaseOrderRet');
		if ($PurchaseOrder)
		{
			$qb_refnumber = "ERR";
			
			initDB();
			$lineitem = mysql_fetch_array(mysql_query("SELECT job_id, vendor_id, task_id, item_id, notes FROM lineitem WHERE id = " . (int) $ID));
			foreach ($PurchaseOrder->children() as $Child)
			{
				if ($Child->name() == 'PurchaseOrderLineRet')
				{
					$items = mysql_query("SELECT id, name FROM item WHERE qb_listid = '" . $Child->getChildDataAt('PurchaseOrderLineRet ItemRef ListID') . "'");
					if ($items && mysql_num_rows($items) == 1)
					{
						$item = mysql_fetch_array($items);
						$query = mysql_query("SELECT id, notes FROM lineitem WHERE job_id = ".$lineitem["job_id"]." AND vendor_id = ".$lineitem["vendor_id"]." AND task_id = ".$lineitem["task_id"]." AND item_id = ".$item["id"]);
						while ($line = mysql_fetch_array($query))
						{
							$name     = ($line["notes"]!="")?$line["notes"]:$item["name"];
							if (htmlspecialchars_decode($Child->getChildDataAt('PurchaseOrderLineRet Desc')) == trim($name))
							{
								if ($ID == $line["id"])
								{
									$qb_refnumber = $PurchaseOrder->getChildDataAt('PurchaseOrderRet RefNumber');
								}
								else
								{
									deQueue($action, $line["id"]);
								}
								
								mysql_query("UPDATE lineitem SET qb_txnlineid = '" . $Child->getChildDataAt('PurchaseOrderLineRet TxnLineID') . "' WHERE id = " . (int) $line["id"]);
								
								break;
							}
						}
					}
				}
			}
					
			mysql_query("UPDATE lineitem SET qb_txnid = '" . $PurchaseOrder->getChildDataAt('PurchaseOrderRet TxnID') . "', qb_editsequence = '" . $PurchaseOrder->getChildDataAt('PurchaseOrderRet EditSequence') . "' WHERE job_id = ".$lineitem["job_id"]." AND vendor_id = ".$lineitem["vendor_id"]." AND task_id = ".$lineitem["task_id"]);
			
			mysql_query("UPDATE lineitem SET qb_refnumber = '" . $qb_refnumber . "' WHERE job_id = ".$lineitem["job_id"]." AND vendor_id = ".$lineitem["vendor_id"]." AND task_id = ".$lineitem["task_id"]." AND qb_txnlineid IS NOT NULL AND qb_txnlineid != '' AND qb_txnlineid != '-1'");
		}
		else if ($Root->getChildAt('QBXML QBXMLMsgsRs HostQueryRs HostQuery') === false)
		{
			initDB();
			mysql_query("UPDATE lineitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
}

function _quickbooks_purchaseorder_query_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	initDB();
	
	if (is_array($extra) && array_key_exists("action", $extra) && $extra["action"] == QUICKBOOKS_MOD_PURCHASEORDER)
	{
		$lineitem    = mysql_fetch_array(mysql_query("SELECT job_id, vendor_id, task_id FROM lineitem WHERE id = " . (int) $ID));
		$query       = mysql_query("SELECT DISTINCT qb_refnumber FROM lineitem WHERE qb_refnumber IS NOT NULL AND qb_refnumber != '' AND qb_refnumber != '...' AND qb_refnumber != 'ERR' AND job_id = ".$lineitem["job_id"]." AND vendor_id = ".$lineitem["vendor_id"]." AND task_id = ".$lineitem["task_id"]);
		if ($query && mysql_num_rows($query) == 1)
		{
			$response = mysql_fetch_array($query);
			$xml .= '<PurchaseOrderQueryRq>
<RefNumber>'.$response["qb_refnumber"].'</RefNumber>
<IncludeLineItems>true</IncludeLineItems>
</PurchaseOrderQueryRq>
';
		}
		else
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_ADD_PURCHASEORDER, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);

	return $xml;
}

function _quickbooks_purchaseorder_query_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$PurchaseOrder = $Root->getChildAt('QBXML QBXMLMsgsRs PurchaseOrderQueryRs PurchaseOrderRet');
		if ($PurchaseOrder && is_array($extra) && array_key_exists("action", $extra))
		{
			initDB();
			$lineitem   = mysql_fetch_array(mysql_query("SELECT job_id, vendor_id, task_id FROM lineitem WHERE id = " . (int) $ID));
			mysql_query("UPDATE lineitem SET qb_txnid = '" . $PurchaseOrder->getChildDataAt('PurchaseOrderRet TxnID') . "', qb_editsequence = '" . $PurchaseOrder->getChildDataAt('PurchaseOrderRet EditSequence') . "' WHERE job_id = ".$lineitem["job_id"]." AND vendor_id = ".$lineitem["vendor_id"]." AND task_id = ".$lineitem["task_id"]);
			
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue($extra["action"], $ID, 1, $extra);
		}
		else if ($Root->getChildAt('QBXML QBXMLMsgsRs HostQueryRs HostQuery') === false)
		{
			initDB();
			mysql_query("UPDATE lineitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
}

function _quickbooks_error_purchaseorderquery($requestID, $user, $action, $ID, $extra, &$err, $xml, $errnum, $errmsg)
{
	$fh = fopen('http-error.txt', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, "RequestID: ".$requestID."\n\nUser: ".$user."\n\nAction: ".$action."\n\nID: ".$ID."\n\nExtra: ".json_encode($extra)."\n\nErr: ".$err."\n\nXML: ".$xml."\n\nErrnum: ".$errnum."\n\nErrmsg: ".$errmsg);
	fclose($fh);

	$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
	$Queue = new QuickBooks_WebConnector_Queue($dsn);
	$Queue->enqueue(QUICKBOOKS_ADD_PURCHASEORDER, $ID, 1, $extra);
	
	return true;
}

function _quickbooks_purchaseorder_add_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	if (is_array($extra) && array_key_exists("action", $extra) && $extra["action"] == QUICKBOOKS_MOD_PURCHASEORDER)
	{
		initDB();
		
		$lineitem  = mysql_fetch_array(mysql_query("SELECT job_id, vendor_id, task_id FROM lineitem WHERE id = " . (int) $ID));
		$vendor    = mysql_fetch_array(mysql_query("SELECT qb_listid FROM vendor WHERE id = " . (int) $lineitem["vendor_id"]));
		if (is_null($vendor["qb_listid"])) {
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_VENDOR, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else
		{
			$job         = mysql_fetch_array(mysql_query("SELECT market_id, subdivision_id, item_id, lot FROM job WHERE id = " . (int) $lineitem["job_id"]));
			$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id, name FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
			$customer    = mysql_fetch_array(mysql_query("SELECT name FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
			$market      = mysql_fetch_array(mysql_query("SELECT city, state FROM market WHERE id = " . (int) $job["market_id"]));
			$saleitem    = mysql_fetch_array(mysql_query("SELECT name FROM item WHERE id = " . (int) $job["item_id"]));
			$task        = mysql_fetch_array(mysql_query("SELECT date FROM task WHERE id = " . (int) $lineitem["task_id"]));
			
			$date = explode(" ",$task["date"]);
			
			$xml .= '<PurchaseOrderAddRq>
<PurchaseOrderAdd>
<VendorRef><ListID>'.$vendor["qb_listid"].'</ListID></VendorRef>
<ClassRef><FullName>'.$market["city"].", ".$market["state"].'</FullName></ClassRef>
<TxnDate>'.$date[0].'</TxnDate>
<Memo>'.$customer["name"] . ":" . $subdivision["name"] . ":Lot " . $job["lot"] . " " . $saleitem["name"].'</Memo>
<PurchaseOrderLineAdd>
<Desc>'.$customer["name"] . ":" . $subdivision["name"] . ":Lot " . $job["lot"] . " " . $saleitem["name"].'</Desc>
</PurchaseOrderLineAdd>
</PurchaseOrderAdd>
</PurchaseOrderAddRq>
';
		}
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);

	return $xml;
}

function _quickbooks_purchaseorder_add_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$PurchaseOrder = $Root->getChildAt('QBXML QBXMLMsgsRs PurchaseOrderAddRs PurchaseOrderRet');
		if ($PurchaseOrder && is_array($extra) && array_key_exists("action", $extra))
		{
			initDB();
			$lineitem   = mysql_fetch_array(mysql_query("SELECT job_id, vendor_id, task_id FROM lineitem WHERE id = " . (int) $ID));
			mysql_query("UPDATE lineitem SET qb_txnid = '" . $PurchaseOrder->getChildDataAt('PurchaseOrderRet TxnID') . "', qb_editsequence = '" . $PurchaseOrder->getChildDataAt('PurchaseOrderRet EditSequence') . "' WHERE job_id = ".$lineitem["job_id"]." AND vendor_id = ".$lineitem["vendor_id"]." AND task_id = ".$lineitem["task_id"]);
			
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue($extra["action"], $ID, 1, $extra);
		}
		else if ($Root->getChildAt('QBXML QBXMLMsgsRs HostQueryRs HostQuery') === false)
		{
			initDB();
			mysql_query("UPDATE lineitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
}

function _quickbooks_vendor_query_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	initDB();
	
	if (is_array($extra) && array_key_exists("action", $extra))
	{
		$lineitem = mysql_fetch_array(mysql_query("SELECT vendor_id FROM lineitem WHERE id = " . (int) $ID));
		$vendor   = mysql_fetch_array(mysql_query("SELECT name FROM vendor WHERE id = " . (int) $lineitem["vendor_id"]));
		$name     = preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
		
		$xml .= '<VendorQueryRq>
<FullName>'.htmlspecialchars($name).'</FullName>
</VendorQueryRq>
';
	}
	else if ($extra == "vendor")
	{
		$vendor   = mysql_fetch_array(mysql_query("SELECT name FROM vendor WHERE id = " . (int) $ID));
		$name     = preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
		
		$xml .= '<VendorQueryRq>
<FullName>'.htmlspecialchars($name).'</FullName>
</VendorQueryRq>
';
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';

	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	return $xml;
}

function _quickbooks_vendor_query_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$Vendor = $Root->getChildAt('QBXML QBXMLMsgsRs VendorQueryRs VendorRet');
		if ($Vendor)
		{
			initDB();
			
			if (is_array($extra) && array_key_exists("action", $extra))
			{
				$lineitem = mysql_fetch_array(mysql_query("SELECT vendor_id FROM lineitem WHERE id = " . (int) $ID));
				mysql_query("UPDATE vendor SET qb_listid = '".$Vendor->getChildDataAt('VendorRet ListID')."' WHERE id = " . (int) $lineitem["vendor_id"]);
				
				if (mysql_affected_rows() > 0)
				{
					$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
					$Queue = new QuickBooks_WebConnector_Queue($dsn);
					if ($extra["action"] == QUICKBOOKS_MOD_PURCHASEORDER)
					{
						$Queue->enqueue(QUICKBOOKS_ADD_PURCHASEORDER, $ID, 1, $extra);
					}
					else
					{
						$Queue->enqueue($extra["action"], $ID, 1, $extra);
					}
				}
			}
			else if ($extra == "vendor")
			{
				mysql_query("UPDATE vendor SET qb_listid = '".$Vendor->getChildDataAt('VendorRet ListID')."' WHERE id = " . (int) $ID);
				
				if (mysql_affected_rows() > 0)
				{
					$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
					$Queue = new QuickBooks_WebConnector_Queue($dsn);
					
					$vendorItems = mysql_query("SELECT id, item_id FROM vendor_item WHERE item_id IS NOT NULL AND vendor_id = " . (int) $ID);
					while ($vendorItem = mysql_fetch_array($vendorItems))
					{
						$query = mysql_query("SELECT id FROM item WHERE item_type_id = 1 AND id = " . (int) $vendorItem["item_id"]);
						if ($query && mysql_num_rows($query) == 1)
						{
							$Queue->enqueue(QUICKBOOKS_QUERY_SERVICEITEM, $vendorItem["id"], 0, "vendor_item");
						}
					}
				}
			}
		}
	}
}

function _quickbooks_timetracking_add_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="6.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	$extra = array();
	$extra["action"] = $action;
	
	initDB();
	
	$lineitems    = mysql_query("SELECT job_id, vendor_id, item_id, task_id, quantity, qb_txnid, qb_editsequence FROM lineitem WHERE id = " . (int) $ID);
	if ($lineitems && mysql_num_rows($lineitems) == 1)
	{
		$lineitem   = mysql_fetch_array($lineitems);
		$job        = mysql_fetch_array(mysql_query("SELECT market_id, qb_listid FROM job WHERE id = " . (int) $lineitem["job_id"]));
		$vendor     = mysql_fetch_array(mysql_query("SELECT name, qb_listid FROM vendor WHERE id = " . (int) $lineitem["vendor_id"]));
		$item       = mysql_fetch_array(mysql_query("SELECT name FROM item WHERE id = " . (int) $lineitem["item_id"]));
		$vendorItem = mysql_fetch_array(mysql_query("SELECT qb_listid FROM vendor_item WHERE vendor_id = " . (int) $lineitem["vendor_id"] . " AND item_id = " . (int) $lineitem["item_id"]));
		if (is_null($vendor["qb_listid"]))
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			if ($item["name"] == "Hourly Per Man")
			{
				$Queue->enqueue(QUICKBOOKS_QUERY_EMPLOYEE, $ID, 1, $extra);
			}
			else
			{
				$Queue->enqueue(QUICKBOOKS_QUERY_VENDOR, $ID, 1, $extra);
			}
			
			$xml .= '<HostQueryRq />
';
		}
		else if (is_null($vendorItem["qb_listid"]))
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_SERVICEITEM, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else if (is_null($job["qb_listid"])) {
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $ID, 1, $extra);
			
			$xml .= '<HostQueryRq />
';
		}
		else
		{
			$market      = mysql_fetch_array(mysql_query("SELECT city, state FROM market WHERE id = " . (int) $job["market_id"]));
			$task        = mysql_fetch_array(mysql_query("SELECT date FROM task WHERE id = " . (int) $lineitem["task_id"]));
			
			$name = preg_replace('/\s?\(.*?\)\s?/','',$vendor["name"]);
			$duration = (float) $lineitem["quantity"];
			$h = (int) floor($duration);
			$m = (int) floor(($duration - $h) * 60);

			$date = explode(" ",$task["date"]);
			
			$TimeTracking = '<TxnDate>'.$date[0].'</TxnDate>
<EntityRef><ListID>'.$vendor["qb_listid"].'</ListID></EntityRef>
<CustomerRef><ListID>'.$job["qb_listid"].'</ListID></CustomerRef>
<ItemServiceRef><ListID>'.$vendorItem["qb_listid"].'</ListID></ItemServiceRef>
<Duration>PT'.$h."H".$m.'M</Duration>
<ClassRef><FullName>'.$market["city"].", ".$market["state"].'</FullName></ClassRef>
';

			if ($item["name"] == "Hourly Per Man")
			{
				$TimeTracking .= '<PayrollItemWageRef><FullName>Hourly Regular Rate</FullName></PayrollItemWageRef>
';
			}

			if (is_null($lineitem["qb_txnid"]) || $lineitem["qb_txnid"] == "")
			{
				$xml .= '<TimeTrackingAddRq>
<TimeTrackingAdd>
'.$TimeTracking.'</TimeTrackingAdd>
</TimeTrackingAddRq>
';
			}
			else
			{
				$xml .= '<TimeTrackingModRq>
<TimeTrackingMod>
<TxnID>'.$lineitem["qb_txnid"].'</TxnID>
<EditSequence>'.$lineitem["qb_editsequence"].'</EditSequence>
'.$TimeTracking.'</TimeTrackingMod>
</TimeTrackingModRq>
';
			}
		}
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);

	return $xml;
}

function _quickbooks_timetracking_add_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$TimeTrackingAdd = $Root->getChildAt('QBXML QBXMLMsgsRs TimeTrackingAddRs TimeTrackingRet');
		$TimeTrackingMod = $Root->getChildAt('QBXML QBXMLMsgsRs TimeTrackingModRs TimeTrackingRet');
		
		initDB();
		
		if ($TimeTrackingAdd)
		{
			mysql_query("UPDATE lineitem SET qb_txnid = '" . $TimeTrackingAdd->getChildDataAt('TimeTrackingRet TxnID') . "', qb_editsequence = '" . $TimeTrackingAdd->getChildDataAt('TimeTrackingRet EditSequence') . "' WHERE id = " . (int) $ID);
			mysql_query("UPDATE lineitem SET qb_refnumber = '&#10004;' WHERE id = " . (int) $ID);
		}
		else if ($TimeTrackingMod)
		{
			mysql_query("UPDATE lineitem SET qb_txnid = '" . $TimeTrackingMod->getChildDataAt('TimeTrackingRet TxnID') . "', qb_editsequence = '" . $TimeTrackingMod->getChildDataAt('TimeTrackingRet EditSequence') . "' WHERE id = " . (int) $ID);
			mysql_query("UPDATE lineitem SET qb_refnumber = '&#10004;' WHERE id = " . (int) $ID);
		}
		else if ($Root->getChildAt('QBXML QBXMLMsgsRs HostQueryRs HostQuery') === false)
		{
			initDB();
			mysql_query("UPDATE lineitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
}

function _quickbooks_employee_query_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';

	$name = "";
	
	initDB();

	if (is_array($extra) && array_key_exists("action", $extra))
	{
		$lineitem = mysql_fetch_array(mysql_query("SELECT vendor_id FROM lineitem WHERE id = " . (int) $ID));
		$vendor   = mysql_fetch_array(mysql_query("SELECT name FROM vendor WHERE id = " . (int) $lineitem["vendor_id"]));
		$name     = preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
	}
	else if ($extra == "vendor" || $extra == "employee")
	{
		$vendor = mysql_fetch_array(mysql_query("SELECT name FROM vendor WHERE id = " . (int) $ID));
		$name   = preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
	}

	$xml .= '<EmployeeQueryRq>
<FullName>'.$name.'</FullName>
</EmployeeQueryRq>
';

	$xml .= '</QBXMLMsgsRq>
</QBXML>';

	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);

	return $xml;
}

function _quickbooks_employee_query_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$Employee = $Root->getChildAt('QBXML QBXMLMsgsRs EmployeeQueryRs EmployeeRet');
		if ($Employee)
		{
			initDB();
			
			if (is_array($extra) && array_key_exists("action", $extra) && array_key_exists("ListID", $idents))
			{
				$lineitem = mysql_fetch_array(mysql_query("SELECT vendor_id FROM lineitem WHERE id = " . (int) $ID));
				mysql_query("UPDATE vendor SET qb_listid = '".$Employee->getChildDataAt('EmployeeRet ListID')."' WHERE id = " . (int) $lineitem["vendor_id"]);
				
				$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
				$Queue = new QuickBooks_WebConnector_Queue($dsn);
				$Queue->enqueue(QUICKBOOKS_ADD_TIMETRACKING, $ID, 1, $extra);
			}
			else if ($extra == "vendor" || $extra == "employee")
			{
				initDB();
				mysql_query("UPDATE vendor SET qb_listid = '".$Employee->getChildDataAt('EmployeeRet ListID')."' WHERE id = " . (int) $ID);
				$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
				$Queue = new QuickBooks_WebConnector_Queue($dsn);
				
				$vendorItems = mysql_query("SELECT id, item_id FROM vendor_item WHERE item_id IS NOT NULL AND vendor_id = " . (int) $ID);
				while ($vendorItem = mysql_fetch_array($vendorItems))
				{
					$query = mysql_query("SELECT id FROM item WHERE item_type_id = 1 AND id = " . (int) $vendorItem["item_id"]);
					if ($query && mysql_num_rows($query) == 1)
					{
						$Queue->enqueue(QUICKBOOKS_QUERY_SERVICEITEM, $vendorItem["id"], 0, "vendor_item");
					}
				}
			}
		}
	}
}

function _quickbooks_error_employeequery($requestID, $user, $action, $ID, $extra, &$err, $xml, $errnum, $errmsg)
{
	$fh = fopen('http-error.txt', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, "RequestID: ".$requestID."\n\nUser: ".$user."\n\nAction: ".$action."\n\nID: ".$ID."\n\nExtra: ".json_encode($extra)."\n\nErr: ".$err."\n\nXML: ".$xml."\n\nErrnum: ".$errnum."\n\nErrmsg: ".$errmsg);
	fclose($fh);
	
	if ($extra == "employee")
	{
		$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
		$Queue = new QuickBooks_WebConnector_Queue($dsn);
		$Queue->enqueue(QUICKBOOKS_ADD_VENDOR, $ID, 1, "vendor");
	}
	else
	{
		$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
		$Queue = new QuickBooks_WebConnector_Queue($dsn);
		$Queue->enqueue(QUICKBOOKS_QUERY_VENDOR, $ID, 1, $extra);
	}
	
	return true;
}

function _quickbooks_ffi_update_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	initDB();
	$customers = mysql_query("SELECT id FROM customer WHERE qb_listid IS NULL");
	$vendors   = mysql_query("SELECT id FROM vendor WHERE qb_listid IS NULL");
	$items     = mysql_query("SELECT id FROM item WHERE item_type_id != 1 AND qb_listid IS NULL");
	
	$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
	$Queue = new QuickBooks_WebConnector_Queue($dsn);
	
	while ($customer = mysql_fetch_array($customers))
	{
		$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $customer["id"], 0, "customer");
	}
	
	$hourlyPerMan = mysql_fetch_array(mysql_query("SELECT id FROM item WHERE item_type_id = 1 AND name = 'Hourly Per Man'"));
	while ($vendor = mysql_fetch_array($vendors))
	{
		$query = mysql_query("SELECT id FROM vendor_item WHERE vendor_id = " . (int) $vendor["id"] . " AND item_id = " . (int) $hourlyPerMan["id"]);
		if ($query && mysql_num_rows($query) > 0)
		{
			$Queue->enqueue(QUICKBOOKS_QUERY_EMPLOYEE, $vendor["id"], 0, "vendor");
		}
		else
		{
			$Queue->enqueue(QUICKBOOKS_QUERY_VENDOR, $vendor["id"], 0, "vendor");
		}
	}
	
	while ($item = mysql_fetch_array($items))
	{
		$Queue->enqueue(QUICKBOOKS_QUERY_SERVICEITEM, $item["id"], 0, "item");
	}
}

function _quickbooks_ffi_update_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
}

function _quickbooks_customer_add_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	initDB();
	
	if (strpos($extra,"customer") === 0)
	{
		if (strpos($extra,"job") !== false)
		{
			$job         = mysql_fetch_array(mysql_query("SELECT subdivision_id FROM job WHERE id = " . (int) $ID));
			$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
			$customer    = mysql_fetch_array(mysql_query("SELECT * FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		}
		else if (strpos($extra,"subdivision") !== false)
		{
			$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id FROM subdivision WHERE id = " . (int) $ID));
			$customer    = mysql_fetch_array(mysql_query("SELECT * FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		}
		else
		{
			$customer    = mysql_fetch_array(mysql_query("SELECT * FROM customer WHERE id = " . (int) $ID));
		}
		$name        = preg_replace('/\s?\(.*?\)\s?/','',trim($customer["name"]));
		
		$Customer = new QuickBooks_QBXML_Object_Customer();
		$Customer->setName($name);
		$Customer->setCompanyName((string) $customer["id"]);
		$Customer->setBillAddress($customer["address1"],$customer["address2"],"","","",$customer["city"],$customer["state"],"",$customer["zip"],"United States");
		$Customer->setPhone($customer["contact_number1"]);
		$Customer->setAltPhone($customer["contact_number2"]);
		$Customer->setFax($customer["contact_fax"]);
		$Customer->setEmail($customer["contact_email1"]);
		$Customer->setContact($customer["contact_name"]);
		 
		$xml .= $Customer->asQBXML(QUICKBOOKS_ADD_CUSTOMER, null, QUICKBOOKS_LOCALE_UNITED_STATES);
	}
	else if (strpos($extra,"subdivision") === 0)
	{
		if (strpos($extra,"job") !== false)
		{
			$job         = mysql_fetch_array(mysql_query("SELECT subdivision_id FROM job WHERE id = " . (int) $ID));
			$subdivision = mysql_fetch_array(mysql_query("SELECT * FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
		}
		else
		{
			$subdivision = mysql_fetch_array(mysql_query("SELECT * FROM subdivision WHERE id = " . (int) $ID));
		}
		$customer    = mysql_fetch_array(mysql_query("SELECT qb_listid FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		$name        = preg_replace('/\s?\(.*?\)\s?/','',trim($subdivision["name"]));
		
		if (!is_null($customer["qb_listid"]))
		{
			$Subdivision = new QuickBooks_QBXML_Object_Customer();
			$Subdivision->setName($name);
			$Subdivision->setBillAddress($subdivision["address1"],$subdivision["address2"],"","","",$subdivision["city"],$subdivision["state"],"",$subdivision["zip"],"United States");
			$Subdivision->setPhone($subdivision["contact_number1"]);
			$Subdivision->setAltPhone($subdivision["contact_number2"]);
			$Subdivision->setFax($subdivision["contact_fax"]);
			$Subdivision->setEmail($subdivision["contact_email1"]);
			$Subdivision->setContact($subdivision["contact_name"]);
			$Subdivision->setParentListID($customer["qb_listid"]);
			 
			$xml .= $Subdivision->asQBXML(QUICKBOOKS_ADD_CUSTOMER, null, QUICKBOOKS_LOCALE_UNITED_STATES);
		}
		else
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $ID, 1, "customer".$extra);
			
			$xml .= '<HostQueryRq />
';
		}
	}
	else if ($extra == "job")
	{
		$job         = mysql_fetch_array(mysql_query("SELECT id, subdivision_id, lot FROM job WHERE id = " . (int) $ID));
		$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id, qb_listid FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
		$customer    = mysql_fetch_array(mysql_query("SELECT * FROM customer WHERE id = " . (int) $subdivision["customer_id"]));
		$name        = $job["id"]." Lot ".preg_replace('/\s?\(.*?\)\s?/','',trim($job["lot"]));
		
		if (!is_null($subdivision["qb_listid"]))
		{
			$Job = new QuickBooks_QBXML_Object_Customer();
			$Job->setName($name);
			$Job->setBillAddress($customer["name"],$customer["address1"],$customer["address2"],"","",$customer["city"],$customer["state"],"",$customer["zip"],"United States");
			$Job->setPhone($customer["contact_number1"]);
			$Job->setAltPhone($customer["contact_number2"]);
			$Job->setFax($customer["contact_fax"]);
			$Job->setEmail($customer["contact_email1"]);
			$Job->setContact($customer["contact_name"]);
			$Job->setParentListID($subdivision["qb_listid"]);
			 
			$xml .= $Job->asQBXML(QUICKBOOKS_ADD_CUSTOMER, null, QUICKBOOKS_LOCALE_UNITED_STATES);
		}
		else
		{
			$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
			$Queue = new QuickBooks_WebConnector_Queue($dsn);
			$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $ID, 1, "subdivision".$extra);
			
			$xml .= '<HostQueryRq />
';
		}
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	return $xml;
}

function _quickbooks_customer_add_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$Customer = $Root->getChildAt('QBXML QBXMLMsgsRs CustomerAddRs CustomerRet');
		if ($Customer)
		{
			initDB();
			
			if (strpos($extra,"customer") !== false || strpos($extra,"subdivision") !== false || $extra == "job")
			{
				$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
				$Queue = new QuickBooks_WebConnector_Queue($dsn);
				if (strpos($extra,"customer") === 0)
				{
					if (strpos($extra,"job") !== false)
					{
						$job         = mysql_fetch_array(mysql_query("SELECT subdivision_id FROM job WHERE id = " . (int) $ID));
						$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id FROM subdivision WHERE id = " . (int) $job["subdivision_id"]));
						$id          = $subdivision["customer_id"];
					}
					else if (strpos($extra,"subdivision") !== false)
					{
						$subdivision = mysql_fetch_array(mysql_query("SELECT customer_id FROM subdivision WHERE id = " . (int) $ID));
						$id          = $subdivision["customer_id"];
					}
					else
					{
						$id          = $ID;
					}
					mysql_query("UPDATE customer SET qb_listid = '".$Customer->getChildDataAt('CustomerRet ListID')."' WHERE id = " . (int) $id);
					if (mysql_affected_rows() > 0)
					{
						$extra = str_replace("customer", "", $extra);
						if ($extra == "")
						{
							$subdivisions = mysql_query("SELECT id FROM subdivision WHERE customer_id = " . (int) $ID);
							while ($subdivision = mysql_fetch_array($subdivisions))
							{
								$Queue->enqueue(QUICKBOOKS_ADD_CUSTOMER, $subdivision["id"], 0, "subdivision");
							}
						}
						else
						{
							$Queue->enqueue(QUICKBOOKS_ADD_CUSTOMER, $ID, 2, $extra);
						}
					}
				}
				else if (strpos($extra,"subdivision") === 0)
				{
					if (strpos($extra,"job") !== false)
					{
						$job         = mysql_fetch_array(mysql_query("SELECT subdivision_id FROM job WHERE id = " . (int) $ID));
						$id          = $job["subdivision_id"];
					}
					else
					{
						$id          = $ID;
					}
					mysql_query("UPDATE subdivision SET qb_listid = '".$Customer->getChildDataAt('CustomerRet ListID')."' WHERE id = " . (int) $id);
					if (mysql_affected_rows() > 0)
					{
						$extra = str_replace("subdivision", "", $extra);
						if ($extra == "")
						{
							$jobs = mysql_query("SELECT id FROM job WHERE subdivision_id = " . (int) $ID);
							while ($job = mysql_fetch_array($jobs))
							{
								$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $job["id"], 0, "job");
							}
						}
						else
						{
							$Queue->enqueue(QUICKBOOKS_ADD_CUSTOMER, $ID, 2, $extra);
						}
					}
				}
				else if ($extra == "job")
				{
					mysql_query("UPDATE job SET qb_listid = '".$Customer->getChildDataAt('CustomerRet ListID')."' WHERE id = " . (int) $ID);
					if (mysql_affected_rows() > 0)
					{
						$saleitems = mysql_query("SELECT id FROM saleitem WHERE job_id = ".$ID." AND qb_refnumber != '...' AND qb_txnlineid IS NOT NULL AND qb_txnlineid != '' AND qb_txnlineid != '-1' LIMIT 1");
						if ($saleitems && mysql_num_rows($saleitems))
						{
							$saleitem = mysql_fetch_array($saleitems);
							$Queue->enqueue(QUICKBOOKS_MOD_SALESORDER, $saleitem["id"], 0, null);
						}
						
						$lineitems = mysql_query("SELECT id FROM lineitem WHERE task_type_id IS NOT NULL AND item_type_id = 1 AND job_id = ".$ID." AND qb_refnumber = '&#10004;'");
						if ($lineitems && mysql_num_rows($lineitems))
						{
							$lineitem = mysql_fetch_array($lineitems);
							$Queue->enqueue(QUICKBOOKS_ADD_TIMETRACKING, $lineitem["id"], 0, null);
						}
					}
				}
			}
		}
	}
}

function _quickbooks_vendor_add_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	initDB();
	
	if ($extra == "vendor")
	{
		$vendor    = mysql_fetch_array(mysql_query("SELECT * FROM vendor WHERE id = " . (int) $ID));
		$name = preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
		
		$Vendor = new QuickBooks_QBXML_Object_Vendor();
		$Vendor->setName($name);
		$Vendor->setCompanyName((string) $vendor["id"]);
		$Vendor->setVendorAddress($vendor["address1"],$vendor["address2"],"","","",$vendor["city"],$vendor["state"],$vendor["zip"],"United States");
		$Vendor->setPhone($vendor["contact_number1"]);
		$Vendor->setAltPhone($vendor["contact_number2"]);
		$Vendor->setFax($vendor["contact_fax"]);
		$Vendor->setEmail($vendor["contact_email1"]);
		$Vendor->setContact($vendor["contact_name"]);
		 
		$xml .= $Vendor->asQBXML(QUICKBOOKS_ADD_VENDOR, null, QUICKBOOKS_LOCALE_UNITED_STATES);
	}
	else
	{
		$xml .= '<'.$action.'_ERROR />
';
	}
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	return $xml;
}

function _quickbooks_vendor_add_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$Vendor = $Root->getChildAt('QBXML QBXMLMsgsRs VendorAddRs VendorRet');
		if ($Vendor)
		{
			initDB();
			
			if ($extra == "vendor")
			{
				initDB();
				mysql_query("UPDATE vendor SET qb_listid = '".$Vendor->getChildDataAt('VendorRet ListID')."' WHERE id = " . (int) $ID);
				
				if (mysql_affected_rows() > 0)
				{
					$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
					$Queue = new QuickBooks_WebConnector_Queue($dsn);
					
					$vendorItems = mysql_query("SELECT id, item_id FROM vendor_item WHERE item_id IS NOT NULL AND vendor_id = " . (int) $ID);
					while ($vendorItem = mysql_fetch_array($vendorItems))
					{
						$query = mysql_query("SELECT id FROM item WHERE item_type_id = 1 AND id = " . (int) $vendorItem["item_id"]);
						if ($query && mysql_num_rows($query) == 1)
						{
							$Queue->enqueue(QUICKBOOKS_QUERY_SERVICEITEM, $vendorItem["id"], 0, "vendor_item");
						}
					}
				}
			}
		}
	}
}

function _quickbooks_serviceitem_add_request($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $version, $locale)
{
	$xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="3.0"?>
<QBXML>
<QBXMLMsgsRq onError="continueOnError">
';
	
	initDB();
	
	$Item = new QuickBooks_QBXML_Object_ServiceItem();
	
	if ($ID == 0 && is_array($extra) && array_key_exists("name", $extra) && array_key_exists("desc", $extra) && array_key_exists("account", $extra))
	{
		$parent = "";
		if (count(explode(":", $extra["name"])) == 2)
		{
			$parts  = explode(":", $extra["name"]);
			$name   = trim($parts[1]);
			$parent .= trim($parts[0]);
		}
		else
		{
			$name = trim($extra["name"]);
		}
		
		$Item->setName($name);
		$Item->setDescription($extra["desc"]);
		$Item->setPrice(0);
		$Item->setAccountName($extra["account"]);
		if ($parent != "")
		{
			$Item->setParentName($parent);
		}
	}
	else if ($extra == "item")
	{
		$item        = mysql_fetch_array(mysql_query("SELECT item_type_id, name FROM item WHERE id = " . (int) $ID));
		$type        = mysql_fetch_array(mysql_query("SELECT name FROM item_type WHERE id = " . (int) $item["item_type_id"]));
		
		if ($type["name"] == "sale")
		{
			$name    = trim($item["name"]);
			$desc    = $name;
			$account = "Construction fees";
			$parent  = "Sale Items";
		}
		else if ($type["name"] != "labor")
		{
			$parent  = "Materials";
			if (count(explode(":", $item["name"])) == 2)
			{
				$parts  = explode(":", $item["name"]);
				$name   = trim($parts[1]);
				$parent .= ":".trim($parts[0]);
			}
			else
			{
				$name = trim($item["name"]);
			}
			$desc    = "Budget Price";
			$account = ($type["name"]!="concrete"&&$type["name"]!="materials")?($type["name"]!="miscellaneous")?($type["name"]!="landscaping_materials")?"":"Cost of Goods Sold:Landscaping Material":"Cost of Goods Sold:Construction Materials Misc":"Cost of Goods Sold:Construction supplies & expense";
		}
		
		$Item->setName($name);
		$Item->setDescription($desc);
		$Item->setPrice(0);
		$Item->setAccountName($account);
		$Item->setParentName($parent);
	}
	else if ($extra == "vendor_item")
	{
		$vendorItem  = mysql_fetch_array(mysql_query("SELECT vendor_id, item_id, default_rate FROM vendor_item WHERE id = " . (int) $ID));
		$vendor      = mysql_fetch_array(mysql_query("SELECT name FROM vendor WHERE id = " . (int) $vendorItem["vendor_id"]));
		$item        = mysql_fetch_array(mysql_query("SELECT name FROM item WHERE id = " . (int) $vendorItem["item_id"]));
		
		$parent = "Subcontract/Employee/Labor";
		if ($item["name"] == "Hourly Per Man")
		{
			$lineitem = mysql_fetch_array(mysql_query("SELECT job_id FROM lineitem WHERE job_id IS NOT NULL AND vendor_id = " . (int) $vendorItem["vendor_id"] . " AND item_id = " . (int) $vendorItem["item_id"] . " ORDER BY job_id DESC LIMIT 1"));
			$job      = mysql_fetch_array(mysql_query("SELECT market_id FROM job WHERE id = " . (int) $lineitem["job_id"]));
			$market   = mysql_fetch_array(mysql_query("SELECT city FROM market WHERE id = " . (int) $job["market_id"]));
			
			$name = preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
			$desc = $market["city"];
			$eAcct = "W-2 Employees:Hourly Labor";
		}
		else
		{
			$name   = preg_replace('/\s?\(.*?\)\s?/','',trim($item["name"]));
			$desc   = $item["name"];
			$parent .= ":".preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
			$eAcct = "Subcontract Labor";
		}
		
		$Item->setName($name);
		$Item->setDescription($desc);
		$Item->setPurchaseCost((float) $vendorItem["default_rate"]);
		$Item->setExpenseAccountName($eAcct);
		$Item->setSalesPrice((float) "0.0");
		$Item->setIncomeAccountName("Construction fees:Construction - Labor");
		$Item->setParentName($parent);
	}
	 
	$xml .= htmlspecialchars_decode($Item->asQBXML(QUICKBOOKS_ADD_SERVICEITEM, null, QUICKBOOKS_LOCALE_UNITED_STATES));
	
	$xml .= '</QBXMLMsgsRq>
</QBXML>';
	
	$fh = fopen('http-send.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	return $xml;
}

function _quickbooks_serviceitem_add_response($requestID, $user, $action, $ID, $extra, &$err, $last_action_time, $last_actionident_time, $xml, $idents)
{
	$fh = fopen('http-receive.xml', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, $xml);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$ServiceItem = $Root->getChildAt('QBXML QBXMLMsgsRs ItemServiceAddRs ItemServiceRet');
		if ($ServiceItem)
		{
			initDB();
			
			if ($extra == "vendor_item" || $extra == "item")
			{
				mysql_query("UPDATE ".$extra." SET qb_listid = '".$ServiceItem->getChildDataAt('ItemServiceRet ListID')."' WHERE id = " . (int) $ID);
			}
		}
	}
}

function _quickbooks_error_namenotunique($requestID, $user, $action, $ID, $extra, &$err, $xml, $errnum, $errmsg)
{
	$fh = fopen('http-error.txt', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, "RequestID: ".$requestID."\n\nUser: ".$user."\n\nAction: ".$action."\n\nID: ".$ID."\n\nErr: ".$err."\n\nXML: ".$xml."\n\nErrnum: ".$errnum."\n\nErrmsg: ".$errmsg);
	fclose($fh);
	
	$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
	$Queue = new QuickBooks_WebConnector_Queue($dsn);
	if ($extra == "customer" || $extra == "subdivision" || $extra == "job")
	{
		$Queue->enqueue(QUICKBOOKS_QUERY_CUSTOMER, $ID, 1, $extra);
	}
	else if ($extra == "vendor")
	{
		$Queue->enqueue(QUICKBOOKS_QUERY_VENDOR, $ID, 1, $extra);
	}
	else if ($extra == "item" || $extra == "vendor_item")
	{
		$Queue->enqueue(QUICKBOOKS_QUERY_SERVICEITEM, $ID, 1, $extra);
	}
	
	return true;
}

function _quickbooks_error_parentrefnotfound($requestID, $user, $action, $ID, $extra, &$err, $xml, $errnum, $errmsg)
{
	$fh = fopen('http-error.txt', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, "RequestID: ".$requestID."\n\nUser: ".$user."\n\nAction: ".$action."\n\nID: ".$ID."\n\nErr: ".$err."\n\nXML: ".$xml."\n\nErrnum: ".$errnum."\n\nErrmsg: ".$errmsg);
	fclose($fh);
	
	initDB();
	
	$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
	$Queue = new QuickBooks_WebConnector_Queue($dsn);
	if ($extra == "item")
	{
		$item        = mysql_fetch_array(mysql_query("SELECT item_type_id, name FROM item WHERE id = " . (int) $ID));
		$type        = mysql_fetch_array(mysql_query("SELECT name FROM item_type WHERE id = " . (int) $item["item_type_id"]));
		$account     = ($type["name"]!="concrete"&&$type["name"]!="materials")?($type["name"]!="miscellaneous")?($type["name"]!="landscaping_materials")?"":"Cost of Goods Sold:Landscaping Material":"Cost of Goods Sold:Construction Materials Misc":"Cost of Goods Sold:Construction supplies & expense";
		
		if ($type["name"] == "sale")
		{
			$desc    = "Sale Items";
			$parent  = "Sale Items";
		}
		else if ($type["name"] != "labor")
		{
			$desc    = "Budget Price";
			$parent  = "Materials";
			if (count(explode(":", $item["name"])) == 2)
			{
				$parts  = explode(":", $item["name"]);
				$parent .= ":".trim($parts[0]);
			}
		}
		
		$p = array();
		$p["name"] = $parent;
		$p["desc"] = $desc;
		$p["account"] = $account;
		
		$Queue->enqueue(QUICKBOOKS_ADD_SERVICEITEM, 0, 1, $p);
		$Queue->enqueue($action, $ID, 1, $extra);
	}
	else if ($extra == "vendor_item")
	{
		$vendorItem  = mysql_fetch_array(mysql_query("SELECT vendor_id, item_id, default_rate FROM vendor_item WHERE id = " . (int) $ID));
		$vendor      = mysql_fetch_array(mysql_query("SELECT name FROM vendor WHERE id = " . (int) $vendorItem["vendor_id"]));
		$item        = mysql_fetch_array(mysql_query("SELECT name FROM item WHERE id = " . (int) $vendorItem["item_id"]));
		
		$desc    = trim($vendor["name"]);
		$parent = "Subcontract/Employee/Labor";
		if ($item["name"] != "Hourly Per Man")
		{
			$parent .= ":".preg_replace('/\s?\(.*?\)\s?/','',trim($vendor["name"]));
		}
		
		$p = array();
		$p["name"] = $parent;
		$p["desc"] = $desc;
		$p["account"] = "Construction fees:Construction - Labor";
		
		$Queue->enqueue(QUICKBOOKS_ADD_SERVICEITEM, 0, 1, $p);
		$Queue->enqueue($action, $ID, 1, $extra);
	}
	
	return true;
}

function _quickbooks_error_outdatededitsequence($requestID, $user, $action, $ID, $extra, &$err, $xml, $errnum, $errmsg)
{
	$fh = fopen('http-error.txt', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, "RequestID: ".$requestID."\n\nUser: ".$user."\n\nAction: ".$action."\n\nID: ".$ID."\n\nErr: ".$err."\n\nXML: ".$xml."\n\nErrnum: ".$errnum."\n\nErrmsg: ".$errmsg);
	fclose($fh);
	
	$errnum = null;
	$errmsg = null;
	$Parser = new QuickBooks_XML_Parser($xml);
	if ($Parser->validate($errnum, $errmsg))
	{
		$Doc = $Parser->parse($errnum, $errmsg);
		$Root = $Doc->getRoot();
		$SalesOrder = $Root->getChildAt('QBXML QBXMLMsgsRs SalesOrderModRs SalesOrderRet');
		$PurchaseOrder = $Root->getChildAt('QBXML QBXMLMsgsRs PurchaseOrderModRs PurchaseOrderRet');
		$TimeTrackingAdd = $Root->getChildAt('QBXML QBXMLMsgsRs TimeTrackingAddRs TimeTrackingRet');
		$TimeTrackingMod = $Root->getChildAt('QBXML QBXMLMsgsRs TimeTrackingModRs TimeTrackingRet');
		
		initDB();
		
		$dsn = 'mysql://ffi:Firm2825@localhost/qbffi';
		$Queue = new QuickBooks_WebConnector_Queue($dsn);
		if ($SalesOrder)
		{
			$saleitem   = mysql_fetch_array(mysql_query("SELECT job_id, name FROM saleitem WHERE id = " . (int) $ID));
			mysql_query("UPDATE saleitem SET qb_txnid = '" . $SalesOrder->getChildDataAt('SalesOrderRet TxnID') . "', qb_editsequence = '" . $SalesOrder->getChildDataAt('SalesOrderRet EditSequence') . "' WHERE job_id = " . (int) $saleitem["job_id"]);
			$Queue->enqueue($action, $ID, 1, $extra);
		}
		else if ($PurchaseOrder)
		{
			$lineitem   = mysql_fetch_array(mysql_query("SELECT job_id, vendor_id, task_id FROM lineitem WHERE id = " . (int) $ID));
			mysql_query("UPDATE lineitem SET qb_txnid = '" . $PurchaseOrder->getChildDataAt('PurchaseOrderRet TxnID') . "', qb_editsequence = '" . $PurchaseOrder->getChildDataAt('PurchaseOrderRet EditSequence') . "' WHERE job_id = ".$lineitem["job_id"]." AND vendor_id = ".$lineitem["vendor_id"]." AND task_id = ".$lineitem["task_id"]);
			$Queue->enqueue($action, $ID, 1, $extra);
		}
		else if ($TimeTrackingAdd)
		{
			mysql_query("UPDATE lineitem SET qb_txnid = '" . $TimeTrackingAdd->getChildDataAt('TimeTrackingRet TxnID') . "', qb_editsequence = '" . $TimeTrackingAdd->getChildDataAt('TimeTrackingRet EditSequence') . "' WHERE id = " . (int) $ID);
			$Queue->enqueue($action, $ID, 1, $extra);
		}
		else if ($TimeTrackingMod)
		{
			mysql_query("UPDATE lineitem SET qb_txnid = '" . $TimeTrackingMod->getChildDataAt('TimeTrackingRet TxnID') . "', qb_editsequence = '" . $TimeTrackingMod->getChildDataAt('TimeTrackingRet EditSequence') . "' WHERE id = " . (int) $ID);
			$Queue->enqueue($action, $ID, 1, $extra);
		}
	}
	
	return true;
}

function _quickbooks_error_catchall($requestID, $user, $action, $ID, $extra, &$err, $xml, $errnum, $errmsg)
{
	$fh = fopen('http-error.txt', 'a+') or die("can't open file");
	fwrite($fh, "\n\n");
	fwrite($fh, "RequestID: ".$requestID."\n\nUser: ".$user."\n\nAction: ".$action."\n\nID: ".$ID."\n\nExtra: ".json_encode($extra)."\n\nErr: ".$err."\n\nXML: ".$xml."\n\nErrnum: ".$errnum."\n\nErrmsg: ".$errmsg);
	fclose($fh);
	
	if (is_array($extra) && array_key_exists("action", $extra))
	{
		initDB();
		if ($extra["action"] == QUICKBOOKS_MOD_PURCHASEORDER || $extra["action"] == QUICKBOOKS_ADD_TIMETRACKING)
		{
			mysql_query("UPDATE lineitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
		else if ($extra["action"] == QUICKBOOKS_MOD_SALESORDER)
		{
			mysql_query("UPDATE saleitem SET qb_refnumber = 'ERR' WHERE id = " . (int) $ID);
		}
	}
	
	return true;
}

