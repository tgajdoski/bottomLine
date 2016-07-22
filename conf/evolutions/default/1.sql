# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table attachment (
  id                        bigint auto_increment not null,
  job_id                    bigint,
  plan_id                   bigint,
  attachment_path           varchar(255),
  constraint pk_attachment primary key (id))
;

create table budget (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  op_multiplier             double,
  bfc_multiplier            double,
  constraint pk_budget primary key (id))
;

create table budget_item (
  id                        bigint auto_increment not null,
  budget_id                 bigint,
  task_type_id              bigint,
  item_type_id              bigint,
  sqft_multiplier           double,
  price_multiplier          double,
  constraint pk_budget_item primary key (id))
;

create table company (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  constraint pk_company primary key (id))
;

create table customer (
  id                        bigint auto_increment not null,
  market_id                 bigint,
  name                      varchar(255),
  address1                  varchar(255),
  address2                  varchar(255),
  city                      varchar(255),
  state                     varchar(255),
  zip                       varchar(255),
  contact_name              varchar(255),
  contact_number1           varchar(255),
  contact_number2           varchar(255),
  contact_fax               varchar(255),
  contact_email1            varchar(255),
  contact_email2            varchar(255),
  contact_email3            varchar(255),
  qb_listid                 varchar(255),
  qb_editsequence           integer,
  constraint pk_customer primary key (id))
;

create table dimension (
  id                        bigint auto_increment not null,
  job_id                    bigint,
  plan_id                   bigint,
  plan_item_id              bigint,
  deduction                 tinyint(1) default 0,
  length_feet               double,
  length_inches             double,
  width_feet                double,
  width_inches              double,
  depth_feet                double,
  depth_inches              double,
  notes                     BLOB,
  constraint pk_dimension primary key (id))
;

create table item (
  id                        bigint auto_increment not null,
  item_type_id              bigint,
  name                      varchar(255),
  qb_listid                 varchar(255),
  constraint pk_item primary key (id))
;

create table item_type (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  markup                    double,
  constraint pk_item_type primary key (id))
;

create table job (
  id                        bigint auto_increment not null,
  job_category_id           bigint,
  market_id                 bigint,
  subdivision_id            bigint,
  budget_id                 bigint,
  plan_id                   bigint,
  item_id                   bigint,
  date                      datetime,
  lot                       varchar(255),
  description               varchar(255),
  lnft                      double,
  sqft                      double,
  cuyds                     double,
  price_per_sqft            double,
  saleprice                 double,
  cost                      double,
  op_multiplier             double,
  bfc_multiplier            double,
  op                        double,
  bfc                       double,
  qb_txnid                  varchar(255),
  qb_txnlineid              varchar(255),
  qb_editsequence           varchar(255),
  qb_listid                 varchar(255),
  notes                     BLOB,
  update_timestamp          datetime not null,
  constraint pk_job primary key (id))
;

create table job_category (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  abbr                      varchar(255),
  constraint pk_job_category primary key (id))
;

create table lineitem (
  id                        bigint auto_increment not null,
  job_id                    bigint,
  plan_id                   bigint,
  plan_item_id              bigint,
  task_type_id              bigint,
  item_type_id              bigint,
  vendor_id                 bigint,
  item_id                   bigint,
  rate                      double,
  units                     varchar(255),
  quantity                  double,
  saleprice                 double,
  multiplier                double,
  markup                    double,
  notes                     BLOB,
  qb_refnumber              varchar(255),
  qb_txnid                  varchar(255),
  qb_editsequence           varchar(255),
  qb_txnlineid              varchar(255),
  user_id                   bigint,
  task_id                   bigint,
  update_timestamp          datetime not null,
  constraint pk_lineitem primary key (id))
;

create table lineitem_percentage (
  id                        bigint auto_increment not null,
  lineitem_id               bigint,
  task_type_id              bigint,
  percentage                double,
  constraint pk_lineitem_percentage primary key (id))
;

create table link (
  id                        bigint auto_increment not null,
  user_id                   bigint,
  name                      varchar(255),
  url                       varchar(255),
  constraint pk_link primary key (id))
;

create table linked_account (
  id                        bigint auto_increment not null,
  user_id                   bigint,
  provider_user_id          varchar(255),
  provider_key              varchar(255),
  constraint pk_linked_account primary key (id))
;

create table login (
  id                        bigint auto_increment not null,
  user_id                   bigint,
  ip                        varchar(255),
  agent                     BLOB,
  info                      BLOB,
  ts                        datetime,
  constraint pk_login primary key (id))
;

create table manager (
  id                        bigint auto_increment not null,
  job_id                    bigint,
  task_id                   bigint,
  user_id                   bigint,
  constraint pk_manager primary key (id))
;

create table market (
  id                        bigint auto_increment not null,
  city                      varchar(255),
  state                     varchar(255),
  url                       varchar(255),
  taxrate                   double,
  constraint pk_market primary key (id))
;

create table plan (
  id                        bigint auto_increment not null,
  customer_id               bigint,
  name                      varchar(255),
  template                  tinyint(1) default 0,
  lnft                      double,
  sqft                      double,
  cuyds                     double,
  price_per_sqft            double,
  saleprice                 double,
  cost                      double,
  qb_listid                 varchar(255),
  qb_editsequence           integer,
  constraint pk_plan primary key (id))
;

create table plan_item (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  constraint pk_plan_item primary key (id))
;

create table rate (
  id                        bigint auto_increment not null,
  item_id                   bigint,
  rate                      double,
  units                     varchar(255),
  constraint pk_rate primary key (id))
;

create table saleitem (
  id                        bigint auto_increment not null,
  job_id                    bigint,
  plan_id                   bigint,
  name                      varchar(255),
  rate                      double,
  units                     varchar(255),
  quantity                  double,
  saleprice                 double,
  notes                     BLOB,
  qb_refnumber              varchar(255),
  qb_txnid                  varchar(255),
  qb_editsequence           varchar(255),
  qb_txnlineid              varchar(255),
  update_timestamp          datetime not null,
  constraint pk_saleitem primary key (id))
;

create table security_role (
  id                        bigint auto_increment not null,
  role_name                 varchar(255),
  constraint pk_security_role primary key (id))
;

create table subdivision (
  id                        bigint auto_increment not null,
  customer_id               bigint,
  name                      varchar(255),
  address1                  varchar(255),
  address2                  varchar(255),
  city                      varchar(255),
  state                     varchar(255),
  zip                       varchar(255),
  contact_name              varchar(255),
  contact_number1           varchar(255),
  contact_number2           varchar(255),
  contact_fax               varchar(255),
  contact_email1            varchar(255),
  contact_email2            varchar(255),
  contact_email3            varchar(255),
  url                       varchar(255),
  qb_listid                 varchar(255),
  constraint pk_subdivision primary key (id))
;

create table task (
  id                        bigint auto_increment not null,
  job_id                    bigint,
  task_type_id              bigint,
  date                      datetime,
  crew                      integer,
  card_order                integer,
  notes                     BLOB,
  completed                 tinyint(1) default 0,
  update_timestamp          datetime not null,
  constraint pk_task primary key (id))
;

create table task_type (
  id                        bigint auto_increment not null,
  name                      varchar(255),
  constraint pk_task_type primary key (id))
;

create table token_action (
  id                        bigint auto_increment not null,
  token                     varchar(255),
  target_user_id            bigint,
  type                      varchar(2),
  created                   datetime,
  expires                   datetime,
  constraint ck_token_action_type check (type in ('RT','AT','EV','PR')),
  constraint uq_token_action_token unique (token),
  constraint pk_token_action primary key (id))
;

create table user (
  id                        bigint auto_increment not null,
  email                     varchar(255),
  company_id                bigint,
  username                  varchar(255),
  password                  varchar(255),
  name                      varchar(255),
  first_name                varchar(255),
  last_name                 varchar(255),
  authority                 integer,
  last_login                datetime,
  active                    tinyint(1) default 0,
  email_validated           tinyint(1) default 0,
  constraint pk_user primary key (id))
;

create table user_permission (
  id                        bigint auto_increment not null,
  value                     varchar(255),
  constraint pk_user_permission primary key (id))
;

create table vendor (
  id                        bigint auto_increment not null,
  market_id                 bigint,
  name                      varchar(255),
  address1                  varchar(255),
  address2                  varchar(255),
  city                      varchar(255),
  state                     varchar(255),
  zip                       varchar(255),
  contact_name              varchar(255),
  contact_number1           varchar(255),
  contact_number2           varchar(255),
  contact_fax               varchar(255),
  contact_email1            varchar(255),
  contact_email2            varchar(255),
  contact_email3            varchar(255),
  qb_listid                 varchar(255),
  qb_editsequence           integer,
  constraint pk_vendor primary key (id))
;

create table vendor_item (
  id                        bigint auto_increment not null,
  vendor_id                 bigint,
  item_id                   bigint,
  default_rate              double,
  default_units             varchar(255),
  qb_listid                 varchar(255),
  qb_editsequence           integer,
  constraint pk_vendor_item primary key (id))
;


create table user_security_role (
  user_id                        bigint not null,
  security_role_id               bigint not null,
  constraint pk_user_security_role primary key (user_id, security_role_id))
;

create table user_user_permission (
  user_id                        bigint not null,
  user_permission_id             bigint not null,
  constraint pk_user_user_permission primary key (user_id, user_permission_id))
;
alter table attachment add constraint fk_attachment_job_1 foreign key (job_id) references job (id) on delete restrict on update restrict;
create index ix_attachment_job_1 on attachment (job_id);
alter table attachment add constraint fk_attachment_plan_2 foreign key (plan_id) references plan (id) on delete restrict on update restrict;
create index ix_attachment_plan_2 on attachment (plan_id);
alter table budget_item add constraint fk_budget_item_budget_3 foreign key (budget_id) references budget (id) on delete restrict on update restrict;
create index ix_budget_item_budget_3 on budget_item (budget_id);
alter table budget_item add constraint fk_budget_item_taskType_4 foreign key (task_type_id) references task_type (id) on delete restrict on update restrict;
create index ix_budget_item_taskType_4 on budget_item (task_type_id);
alter table budget_item add constraint fk_budget_item_itemType_5 foreign key (item_type_id) references item_type (id) on delete restrict on update restrict;
create index ix_budget_item_itemType_5 on budget_item (item_type_id);
alter table customer add constraint fk_customer_market_6 foreign key (market_id) references market (id) on delete restrict on update restrict;
create index ix_customer_market_6 on customer (market_id);
alter table dimension add constraint fk_dimension_job_7 foreign key (job_id) references job (id) on delete restrict on update restrict;
create index ix_dimension_job_7 on dimension (job_id);
alter table dimension add constraint fk_dimension_plan_8 foreign key (plan_id) references plan (id) on delete restrict on update restrict;
create index ix_dimension_plan_8 on dimension (plan_id);
alter table dimension add constraint fk_dimension_planItem_9 foreign key (plan_item_id) references plan_item (id) on delete restrict on update restrict;
create index ix_dimension_planItem_9 on dimension (plan_item_id);
alter table item add constraint fk_item_itemType_10 foreign key (item_type_id) references item_type (id) on delete restrict on update restrict;
create index ix_item_itemType_10 on item (item_type_id);
alter table job add constraint fk_job_jobCategory_11 foreign key (job_category_id) references job_category (id) on delete restrict on update restrict;
create index ix_job_jobCategory_11 on job (job_category_id);
alter table job add constraint fk_job_market_12 foreign key (market_id) references market (id) on delete restrict on update restrict;
create index ix_job_market_12 on job (market_id);
alter table job add constraint fk_job_subdivision_13 foreign key (subdivision_id) references subdivision (id) on delete restrict on update restrict;
create index ix_job_subdivision_13 on job (subdivision_id);
alter table job add constraint fk_job_budget_14 foreign key (budget_id) references budget (id) on delete restrict on update restrict;
create index ix_job_budget_14 on job (budget_id);
alter table job add constraint fk_job_plan_15 foreign key (plan_id) references plan (id) on delete restrict on update restrict;
create index ix_job_plan_15 on job (plan_id);
alter table job add constraint fk_job_item_16 foreign key (item_id) references item (id) on delete restrict on update restrict;
create index ix_job_item_16 on job (item_id);
alter table lineitem add constraint fk_lineitem_job_17 foreign key (job_id) references job (id) on delete restrict on update restrict;
create index ix_lineitem_job_17 on lineitem (job_id);
alter table lineitem add constraint fk_lineitem_plan_18 foreign key (plan_id) references plan (id) on delete restrict on update restrict;
create index ix_lineitem_plan_18 on lineitem (plan_id);
alter table lineitem add constraint fk_lineitem_planItem_19 foreign key (plan_item_id) references plan_item (id) on delete restrict on update restrict;
create index ix_lineitem_planItem_19 on lineitem (plan_item_id);
alter table lineitem add constraint fk_lineitem_taskType_20 foreign key (task_type_id) references task_type (id) on delete restrict on update restrict;
create index ix_lineitem_taskType_20 on lineitem (task_type_id);
alter table lineitem add constraint fk_lineitem_itemType_21 foreign key (item_type_id) references item_type (id) on delete restrict on update restrict;
create index ix_lineitem_itemType_21 on lineitem (item_type_id);
alter table lineitem add constraint fk_lineitem_vendor_22 foreign key (vendor_id) references vendor (id) on delete restrict on update restrict;
create index ix_lineitem_vendor_22 on lineitem (vendor_id);
alter table lineitem add constraint fk_lineitem_item_23 foreign key (item_id) references item (id) on delete restrict on update restrict;
create index ix_lineitem_item_23 on lineitem (item_id);
alter table lineitem add constraint fk_lineitem_user_24 foreign key (user_id) references user (id) on delete restrict on update restrict;
create index ix_lineitem_user_24 on lineitem (user_id);
alter table lineitem add constraint fk_lineitem_task_25 foreign key (task_id) references task (id) on delete restrict on update restrict;
create index ix_lineitem_task_25 on lineitem (task_id);
alter table lineitem_percentage add constraint fk_lineitem_percentage_lineitem_26 foreign key (lineitem_id) references lineitem (id) on delete restrict on update restrict;
create index ix_lineitem_percentage_lineitem_26 on lineitem_percentage (lineitem_id);
alter table lineitem_percentage add constraint fk_lineitem_percentage_taskType_27 foreign key (task_type_id) references task_type (id) on delete restrict on update restrict;
create index ix_lineitem_percentage_taskType_27 on lineitem_percentage (task_type_id);
alter table link add constraint fk_link_user_28 foreign key (user_id) references user (id) on delete restrict on update restrict;
create index ix_link_user_28 on link (user_id);
alter table linked_account add constraint fk_linked_account_user_29 foreign key (user_id) references user (id) on delete restrict on update restrict;
create index ix_linked_account_user_29 on linked_account (user_id);
alter table login add constraint fk_login_user_30 foreign key (user_id) references user (id) on delete restrict on update restrict;
create index ix_login_user_30 on login (user_id);
alter table manager add constraint fk_manager_job_31 foreign key (job_id) references job (id) on delete restrict on update restrict;
create index ix_manager_job_31 on manager (job_id);
alter table manager add constraint fk_manager_task_32 foreign key (task_id) references task (id) on delete restrict on update restrict;
create index ix_manager_task_32 on manager (task_id);
alter table manager add constraint fk_manager_user_33 foreign key (user_id) references user (id) on delete restrict on update restrict;
create index ix_manager_user_33 on manager (user_id);
alter table plan add constraint fk_plan_customer_34 foreign key (customer_id) references customer (id) on delete restrict on update restrict;
create index ix_plan_customer_34 on plan (customer_id);
alter table rate add constraint fk_rate_item_35 foreign key (item_id) references item (id) on delete restrict on update restrict;
create index ix_rate_item_35 on rate (item_id);
alter table saleitem add constraint fk_saleitem_job_36 foreign key (job_id) references job (id) on delete restrict on update restrict;
create index ix_saleitem_job_36 on saleitem (job_id);
alter table saleitem add constraint fk_saleitem_plan_37 foreign key (plan_id) references plan (id) on delete restrict on update restrict;
create index ix_saleitem_plan_37 on saleitem (plan_id);
alter table subdivision add constraint fk_subdivision_customer_38 foreign key (customer_id) references customer (id) on delete restrict on update restrict;
create index ix_subdivision_customer_38 on subdivision (customer_id);
alter table task add constraint fk_task_job_39 foreign key (job_id) references job (id) on delete restrict on update restrict;
create index ix_task_job_39 on task (job_id);
alter table task add constraint fk_task_taskType_40 foreign key (task_type_id) references task_type (id) on delete restrict on update restrict;
create index ix_task_taskType_40 on task (task_type_id);
alter table token_action add constraint fk_token_action_targetUser_41 foreign key (target_user_id) references user (id) on delete restrict on update restrict;
create index ix_token_action_targetUser_41 on token_action (target_user_id);
alter table user add constraint fk_user_company_42 foreign key (company_id) references company (id) on delete restrict on update restrict;
create index ix_user_company_42 on user (company_id);
alter table vendor add constraint fk_vendor_market_43 foreign key (market_id) references market (id) on delete restrict on update restrict;
create index ix_vendor_market_43 on vendor (market_id);
alter table vendor_item add constraint fk_vendor_item_vendor_44 foreign key (vendor_id) references vendor (id) on delete restrict on update restrict;
create index ix_vendor_item_vendor_44 on vendor_item (vendor_id);
alter table vendor_item add constraint fk_vendor_item_item_45 foreign key (item_id) references item (id) on delete restrict on update restrict;
create index ix_vendor_item_item_45 on vendor_item (item_id);



alter table user_security_role add constraint fk_user_security_role_user_01 foreign key (user_id) references user (id) on delete restrict on update restrict;

alter table user_security_role add constraint fk_user_security_role_security_role_02 foreign key (security_role_id) references security_role (id) on delete restrict on update restrict;

alter table user_user_permission add constraint fk_user_user_permission_user_01 foreign key (user_id) references user (id) on delete restrict on update restrict;

alter table user_user_permission add constraint fk_user_user_permission_user_permission_02 foreign key (user_permission_id) references user_permission (id) on delete restrict on update restrict;

# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table attachment;

drop table budget;

drop table budget_item;

drop table company;

drop table customer;

drop table dimension;

drop table item;

drop table item_type;

drop table job;

drop table job_category;

drop table lineitem;

drop table lineitem_percentage;

drop table link;

drop table linked_account;

drop table login;

drop table manager;

drop table market;

drop table plan;

drop table plan_item;

drop table rate;

drop table saleitem;

drop table security_role;

drop table subdivision;

drop table task;

drop table task_type;

drop table token_action;

drop table user;

drop table user_security_role;

drop table user_user_permission;

drop table user_permission;

drop table vendor;

drop table vendor_item;

SET FOREIGN_KEY_CHECKS=1;

