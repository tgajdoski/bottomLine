# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table quickbooks_queue (
  quickbooks_queue_id       int(10) UNSIGNED auto_increment not null,
  quickbooks_ticket_id      int(10) UNSIGNED,
  qb_username               varchar(40),
  qb_action                 varchar(32) not null,
  ident                     varchar(40) not null,
  extra                     text,
  qbxml                     text,
  priority                  int(10) UNSIGNED DEFAULT '0',
  qb_status                 char(1) NOT NULL,
  msg                       text,
  enqueue_datetime          datetime not null,
  dequeue_datetime          datetime DEFAULT NULL,
  constraint uq_quickbooks_queue_1 unique (quickbooks_ticket_id),
  constraint uq_quickbooks_queue_2 unique (priority),
  constraint uq_quickbooks_queue_3 unique (qb_username,qb_action,ident,qb_status),
  constraint uq_quickbooks_queue_4 unique (qb_status),
  constraint pk_quickbooks_queue primary key (quickbooks_queue_id))
;

create table quickbooks_ticket (
  quickbooks_ticket_id      int(10) UNSIGNED auto_increment not null,
  qb_username               varchar(40),
  ticket                    char(36) NOT NULL,
  processed                 int(10) UNSIGNED DEFAULT '0',
  lasterror_num             varchar(32) DEFAULT NULL,
  lasterror_msg             varchar(255) DEFAULT NULL,
  ipaddr                    char(15) NOT NULL,
  write_datetime            datetime not null,
  touch_datetime            datetime not null,
  constraint uq_quickbooks_ticket_1 unique (ticket),
  constraint pk_quickbooks_ticket primary key (quickbooks_ticket_id))
;

create table quickbooks_user (
  qb_username               varchar(40) not null,
  qb_password               varchar(255) not null,
  qb_company_file           varchar(255) DEFAULT NULL,
  qbwc_wait_before_next_update int(10) UNSIGNED,
  qbwc_min_run_every_n_seconds int(10) UNSIGNED,
  status                    char(1) NOT NULL,
  write_datetime            datetime not null,
  touch_datetime            datetime not null,
  constraint pk_quickbooks_user primary key (qb_username))
;

alter table quickbooks_queue add constraint fk_quickbooks_queue_ticket_1 foreign key (quickbooks_ticket_id) references quickbooks_ticket (quickbooks_ticket_id) on delete restrict on update restrict;
create index ix_quickbooks_queue_ticket_1 on quickbooks_queue (quickbooks_ticket_id);
alter table quickbooks_queue add constraint fk_quickbooks_queue_username_2 foreign key (qb_username) references quickbooks_user (qb_username) on delete restrict on update restrict;
create index ix_quickbooks_queue_username_2 on quickbooks_queue (qb_username);
alter table quickbooks_ticket add constraint fk_quickbooks_ticket_username_3 foreign key (qb_username) references quickbooks_user (qb_username) on delete restrict on update restrict;
create index ix_quickbooks_ticket_username_3 on quickbooks_ticket (qb_username);



# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table quickbooks_queue;

drop table quickbooks_ticket;

drop table quickbooks_user;

SET FOREIGN_KEY_CHECKS=1;

