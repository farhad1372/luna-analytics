
const state = {
   queries: {
      'daily-staking-action': {
         result: null,
         sql: `select 
            sum(AMOUNT) as volume,
            count(*) as number,ACTION, date_trunc('day',BLOCK_TIMESTAMP ) as date
            from terra.core.ez_staking
            group by 3,4 order by date asc`
      },
      'Daily-averag-reward-volume-per-transaction': {
         result: null,
         sql: ` with t1 as 
            (select
              avg(CLOSE) as price, date_trunc('day',RECORDED_HOUR) as datee from 
            crosschain.core.fact_hourly_prices
            where 
            ID = 'terra-luna-2'
            group by datee),
            t2 as 
            ( select *,date_trunc('day',BLOCK_TIMESTAMP) as date
            from 
            terra.core.ez_transfers 
            where 
              MESSAGE_VALUE['@type'] ='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
              and 
              CURRENCY='uluna'),
               ll as
            (select AMOUNT*PRICE/1e6 as usd,* from t1 a inner join t2 b 
            on a.datee=b.date )
            
            select avg(usd) as average, date 
            from ll 
            group by date order by date asc`
      },
      'Number-of-reward-transaction-per-day': {
         result: null,
         sql: `select count(*) as number,date_trunc('day',BLOCK_TIMESTAMP) as date
            from 
            terra.core.ez_transfers 
            where 
            MESSAGE_VALUE['@type'] ='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
            and 
            CURRENCY='uluna'
            group by date`
      },
      'Luna-balance-distribution': {
         result: null,
         sql: `with sender as
            (select 
            sum(AMOUNT) as send, SENDER
              from terra.core.ez_transfers
              where
            CURRENCY='uluna'
            group by 2), 
            
            RECEIVER
            as 
            (
            select 
            sum(AMOUNT) as receive, RECEIVER
              from terra.core.ez_transfers
              where
            CURRENCY='uluna'
            group by 2
              
            )
            
            , asa as 
            (select 
              case when receive is null then 0 else receive end as receivee, RECEIVER as user , (receivee-send)/1e6 as balance
              
              from sender a left join RECEIVER b 
            on a.sender=b.RECEIVER 
            order by balance desc)
            
            
            (select 
            count(*) as wallet_number, 
            '0-1' as balance_range 
            from asa 
            where balance < 1 )
            
            union ALL
            
            (select 
            count(*) as wallet_number, 
            '1-10' as balance_range 
            from asa 
            where balance between 1 and 10 )
            
            
            union ALL
            
            (select 
            count(*) as wallet_number, 
            '10-100' as balance_range 
            from asa 
            where balance between 10 and 100 )
            
            
            union ALL
            
            (select 
            count(*) as wallet_number, 
            '100-1000' as balance_range 
            from asa 
            where balance between 100 and 1000 )
            
            
            union ALL
            
            (select 
            count(*) as wallet_number, 
            '1000-10000' as balance_range 
            from asa 
            where balance between 1000 and 10000 )
            
            
            union ALL
            
            (select 
            count(*) as wallet_number, 
            '10000-100000' as balance_range 
            from asa 
            where balance between 10000 and 100000 )
            
            
            union ALL
            
            (select 
            count(*) as wallet_number, 
            '100000-1000000' as balance_range 
            from asa 
            where balance between 100000 and 1000000 )
            
            union ALL
            
            (select 
            count(*) as wallet_number, 
            '1000000-10000000' as balance_range 
            from asa 
            where balance between 1000000 and 10000000 )
            
            union ALL
            
            (select 
            count(*) as wallet_number, 
            '10000000-100000000' as balance_range 
            from asa 
            where balance between 10000000 and 100000000 )`
      },
      'Distribution-of-reward-receivers': {
         result: null,
         sql: ` with t1 as 
            (select
              avg(CLOSE) as price, date_trunc('day',RECORDED_HOUR) as datee from 
            crosschain.core.fact_hourly_prices
            where 
            ID = 'terra-luna-2'
            group by datee),
            t2 as 
            ( select *,date_trunc('day',BLOCK_TIMESTAMP) as date
            from 
            terra.core.ez_transfers 
            where 
              MESSAGE_VALUE['@type'] ='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
              and 
              CURRENCY='uluna'),
               lll as
            
            
            (select AMOUNT*PRICE/1e6 as usd,* from t1 a inner join t2 b 
            on a.datee=b.date )
            
            , ll as 
            (select sum(usd) as usd , RECEIVER from lll 
            group by 2)
            
            (select count(*) as number , 
               '0-1$' as reward_range
               from ll
               where usd between 0 and 1
               )
            
            union all 
            
            (select count(*) as number , 
               '1-10$' as reward_range
               from ll
               where usd between 1 and 10
               )
            
            
            union all 
            
            (select count(*) as number , 
               '10-100$' as reward_range
               from ll
               where usd between 10 and 100
               )
            
            
            union all 
            
            (select count(*) as number , 
               '100-1000$' as reward_range
               from ll
               where usd between 100 and 1000
               )
            
            
            union all 
            
            (select count(*) as number , 
               '1000-10K$' as reward_range
               from ll
               where usd between 1000 and 10000
               )
            
            
            union all 
            
            (select count(*) as number , 
               '10K-100K$' as reward_range
               from ll
               where usd between 10000 and 100000
               )
            
            
            union all 
            
            (select count(*) as number , 
               '100K-1000K$' as reward_range
               from ll
               where usd between 100000 and 1000000
               )
            
            
            union all 
            
            (select count(*) as number , 
               '1000K-10000K$' as reward_range
               from ll
               where usd between 1000000 and 10000000)`
      },
      'Distribution-of-rewards-$': {
         result: null,
         sql: ` with t1 as 

            (select
              avg(CLOSE) as price, date_trunc('day',RECORDED_HOUR) as datee from 
            crosschain.core.fact_hourly_prices
            where 
            ID = 'terra-luna-2'
            group by datee),
            t2 as 
            ( select *,date_trunc('day',BLOCK_TIMESTAMP) as date
            from 
            terra.core.ez_transfers 
            where 
              MESSAGE_VALUE['@type'] ='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
              and 
              CURRENCY='uluna'),
               ll as
            
            
            (select AMOUNT*PRICE/1e6 as usd,* from t1 a inner join t2 b 
            on a.datee=b.date )
            
            (select count(*) as number , 
               '0-1$' as reward_range
               from ll
               where usd between 0 and 1
               )
            
            union all 
            
            (select count(*) as number , 
               '1-10$' as reward_range
               from ll
               where usd between 1 and 10
               )
            
            
            union all 
            
            (select count(*) as number , 
               '10-100$' as reward_range
               from ll
               where usd between 10 and 100
               )
            
            
            union all 
            
            (select count(*) as number , 
               '100-1000$' as reward_range
               from ll
               where usd between 100 and 1000
               )
            
            
            union all 
            
            (select count(*) as number , 
               '1000-10K$' as reward_range
               from ll
               where usd between 1000 and 10000
               )
            
            
            union all 
            
            (select count(*) as number , 
               '10K-100K$' as reward_range
               from ll
               where usd between 10000 and 100000
               )
            
            
            union all 
            
            (select count(*) as number , 
               '100K-1000K$' as reward_range
               from ll
               where usd between 100000 and 1000000
               )
            
            `
      },
      'Rich-list-top-100': {
         result: null,
         sql: `with sender as
         (select 
         sum(AMOUNT) as send, SENDER
           from terra.core.ez_transfers
           where
         CURRENCY='uluna'
         group by 2), 
         
         RECEIVER
         as 
         (
         select 
         sum(AMOUNT) as receive, RECEIVER
           from terra.core.ez_transfers
           where
         CURRENCY='uluna'
         group by 2
           
         )
         
         
         select 
           case when receive is null then 0 else receive end as receivee, RECEIVER as user , (receivee-send)/1e6 as balance
           
           from sender a left join RECEIVER b 
         on a.sender=b.RECEIVER 
         order by balance desc
         limit 100`
      },
      'Distribution-of-bridgers-based-their-bridged-out-Luna-number': {
         result: null,
         sql: `with bridge_outt as
         (select date_trunc('day',BLOCK_TIMESTAMP) as date,MESSAGE_VALUE['sender'] as senderr, MESSAGE_VALUE['receiver'] as receiverr,(AMOUNT/1e6) as volume
           , 
           case 
           when SUBSTR(receiverr, 0, 4) = 'osmo' then 'osmo' 
           when SUBSTR(receiverr, 0, 4) = 'axel' then 'axelar' 
           when SUBSTR(receiverr, 0, 4) = 'grav' then 'GRAV' 
           when SUBSTR(receiverr, 0, 4) = 'secr' then 'secret' 
           when SUBSTR(receiverr, 0, 4) = 'terr' then 'terra' 
           when SUBSTR(receiverr, 0, 3) = 'cre' then 'CRE'
           when SUBSTR(receiverr, 0, 3) = 'sif' then 'SIF'
           when SUBSTR(receiverr, 0, 4) = 'kuji' then 'kujira'
           when SUBSTR(receiverr, 0, 4) = 'cosm' then 'cosmos'
           when SUBSTR(receiverr, 0, 4) = 'evmo' then 'evmos'
           when SUBSTR(receiverr, 0, 4) = 'stri' then 'STRI'
           when SUBSTR(receiverr, 0, 4) = 'juno' then 'juno'
           else null end as blockchain
         
           
           from terra.core.ez_transfers
         where 
         MESSAGE_TYPE='/ibc.applications.transfer.v1.MsgTransfer' and CURRENCY='uluna'),
         
           
         bridge_out as 
         (select sum(volume) as volume ,senderr from bridge_outt 
         
         group by 2 
         order by 1 desc )
         
         
         
         
         (select COUNT(*) as number 
           , '0-1' as bridge_range
           from bridge_out 
           where volume between 0 and 1)
         
         union all
         
         (select COUNT(*) as number 
           , '1-10' as bridge_range
           from bridge_out 
           where volume between 1 and 10)
         
         
         union all
         
         (select COUNT(*) as number 
           , '10-100' as bridge_range
           from bridge_out 
           where volume between 10 and 100)
         
         
         union all
         
         (select COUNT(*) as number 
           , '100-1000' as bridge_range
           from bridge_out 
           where volume between 100 and 1000)
         
         
         union all
         
         (select COUNT(*) as number 
           , '1000-10000' as bridge_range
           from bridge_out 
           where volume between 1000 and 10000)
         
         union all
         
         (select COUNT(*) as number 
           , '10000-100000' as bridge_range
           from bridge_out 
           where volume between 10000 and 100000)
         
           `
      },
      'Distribution-of-bridging-out-transaction-base-of-their-volume-range': {
         result: null,
         sql: `with bridge_out as
         (select date_trunc('day',BLOCK_TIMESTAMP) as date,MESSAGE_VALUE['sender'] as senderr, MESSAGE_VALUE['receiver'] as receiverr,(AMOUNT/1e6) as volume
           , 
           case 
           when SUBSTR(receiverr, 0, 4) = 'osmo' then 'osmo' 
           when SUBSTR(receiverr, 0, 4) = 'axel' then 'axelar' 
           when SUBSTR(receiverr, 0, 4) = 'grav' then 'GRAV' 
           when SUBSTR(receiverr, 0, 4) = 'secr' then 'secret' 
           when SUBSTR(receiverr, 0, 4) = 'terr' then 'terra' 
           when SUBSTR(receiverr, 0, 3) = 'cre' then 'CRE'
           when SUBSTR(receiverr, 0, 3) = 'sif' then 'SIF'
           when SUBSTR(receiverr, 0, 4) = 'kuji' then 'kujira'
           when SUBSTR(receiverr, 0, 4) = 'cosm' then 'cosmos'
           when SUBSTR(receiverr, 0, 4) = 'evmo' then 'evmos'
           when SUBSTR(receiverr, 0, 4) = 'stri' then 'STRI'
           when SUBSTR(receiverr, 0, 4) = 'juno' then 'juno'
           else null end as blockchain
         
           
           from terra.core.ez_transfers
         where 
         MESSAGE_TYPE='/ibc.applications.transfer.v1.MsgTransfer' and CURRENCY='uluna')
         
         
         (select COUNT(*) as number 
           , '0-1' as bridge_range
           from bridge_out 
           where volume between 0 and 1)
         
         union all
         
         (select COUNT(*) as number 
           , '1-10' as bridge_range
           from bridge_out 
           where volume between 1 and 10)
         
         
         union all
         
         (select COUNT(*) as number 
           , '10-100' as bridge_range
           from bridge_out 
           where volume between 10 and 100)
         
         
         union all
         
         (select COUNT(*) as number 
           , '100-1000' as bridge_range
           from bridge_out 
           where volume between 100 and 1000)
         
         
         union all
         
         (select COUNT(*) as number 
           , '1000-10000' as bridge_range
           from bridge_out 
           where volume between 1000 and 10000)
         
         union all
         
         (select COUNT(*) as number 
           , '10000-100000' as bridge_range
           from bridge_out 
           where volume between 10000 and 100000)`
      },
      'The-top-20-addresses-with-the-most-bridged-out-Luna': {
         result: null,
         sql: `with bridge_out as
         (select date_trunc('day',BLOCK_TIMESTAMP) as date,MESSAGE_VALUE['sender'] as senderr, MESSAGE_VALUE['receiver'] as receiverr,(AMOUNT/1e6) as volume
           , 
           case 
           when SUBSTR(receiverr, 0, 4) = 'osmo' then 'osmo' 
           when SUBSTR(receiverr, 0, 4) = 'axel' then 'axelar' 
           when SUBSTR(receiverr, 0, 4) = 'grav' then 'GRAV' 
           when SUBSTR(receiverr, 0, 4) = 'secr' then 'secret' 
           when SUBSTR(receiverr, 0, 4) = 'terr' then 'terra' 
           when SUBSTR(receiverr, 0, 3) = 'cre' then 'CRE'
           when SUBSTR(receiverr, 0, 3) = 'sif' then 'SIF'
           when SUBSTR(receiverr, 0, 4) = 'kuji' then 'kujira'
           when SUBSTR(receiverr, 0, 4) = 'cosm' then 'cosmos'
           when SUBSTR(receiverr, 0, 4) = 'evmo' then 'evmos'
           when SUBSTR(receiverr, 0, 4) = 'stri' then 'STRI'
           when SUBSTR(receiverr, 0, 4) = 'juno' then 'juno'
           else null end as blockchain
         
           
           from terra.core.ez_transfers
         where 
         MESSAGE_TYPE='/ibc.applications.transfer.v1.MsgTransfer' and CURRENCY='uluna')
         
         select sum(volume) as volume ,senderr from bridge_out 
         
         group by 2 
         order by 1 desc 
         limit 20`
      },
      'The-average-bridged-out-of-Luna': {
         result: null,
         sql: `with bridge_out as
         (select date_trunc('day',BLOCK_TIMESTAMP) as date,MESSAGE_VALUE['sender'] as senderr, MESSAGE_VALUE['receiver'] as receiverr,(AMOUNT/1e6) as volume
           , 
           case 
           when SUBSTR(receiverr, 0, 4) = 'osmo' then 'osmo' 
           when SUBSTR(receiverr, 0, 4) = 'axel' then 'axelar' 
           when SUBSTR(receiverr, 0, 4) = 'grav' then 'GRAV' 
           when SUBSTR(receiverr, 0, 4) = 'secr' then 'secret' 
           when SUBSTR(receiverr, 0, 4) = 'terr' then 'terra' 
           when SUBSTR(receiverr, 0, 3) = 'cre' then 'CRE'
           when SUBSTR(receiverr, 0, 3) = 'sif' then 'SIF'
           when SUBSTR(receiverr, 0, 4) = 'kuji' then 'kujira'
           when SUBSTR(receiverr, 0, 4) = 'cosm' then 'cosmos'
           when SUBSTR(receiverr, 0, 4) = 'evmo' then 'evmos'
           when SUBSTR(receiverr, 0, 4) = 'stri' then 'STRI'
           when SUBSTR(receiverr, 0, 4) = 'juno' then 'juno'
           else null end as blockchain
         
           
           from terra.core.ez_transfers
         where 
         MESSAGE_TYPE='/ibc.applications.transfer.v1.MsgTransfer' and CURRENCY='uluna'),
         
         sda as 
         (select count(*) as number, sum(VOLUME) as volume ,avg(volume) as d, count(distinct SENDERR) as active_users ,DATE from bridge_out 
         group by 5),
          hkk as
         (select sum(volume) over (order by date) as Cumulative_volume ,
          * 
         from sda)
         select * from hkk order by date asc`
      },
      'Daily-bridge-out-active-users': {
         result: null,
         sql: `with bridge_out as
         (select date_trunc('week',BLOCK_TIMESTAMP) as date,MESSAGE_VALUE['sender'] as senderr, MESSAGE_VALUE['receiver'] as receiverr,(AMOUNT/1e6) as volume, 
           case 
           when SUBSTR(receiverr, 0, 4) = 'osmo' then 'osmo' 
           when SUBSTR(receiverr, 0, 4) = 'axel' then 'axelar' 
           when SUBSTR(receiverr, 0, 4) = 'grav' then 'GRAV' 
           when SUBSTR(receiverr, 0, 4) = 'secr' then 'secret' 
           when SUBSTR(receiverr, 0, 4) = 'terr' then 'terra' 
           when SUBSTR(receiverr, 0, 3) = 'cre' then 'CRE'
           when SUBSTR(receiverr, 0, 3) = 'sif' then 'SIF'
           when SUBSTR(receiverr, 0, 4) = 'kuji' then 'kujira'
           when SUBSTR(receiverr, 0, 4) = 'cosm' then 'cosmos'
           when SUBSTR(receiverr, 0, 4) = 'evmo' then 'evmos'
           when SUBSTR(receiverr, 0, 4) = 'stri' then 'STRI'
           when SUBSTR(receiverr, 0, 4) = 'juno' then 'juno'
           else null end as blockchain
         
           
           from terra.core.ez_transfers
         where 
         MESSAGE_TYPE='/ibc.applications.transfer.v1.MsgTransfer' and CURRENCY='uluna')
         
         
         select count(*) as number, sum(VOLUME) as volume , count(distinct SENDERR) as active_users ,BLOCKCHAIN,DATE from bridge_out 
         group by 4,5 order by date asc`
      },
      'Daily-Luna-bridged-out-volume-by-chains': {
         result: null,
         sql: `with bridge_out as
         (select date_trunc('week',BLOCK_TIMESTAMP) as date,MESSAGE_VALUE['sender'] as senderr, MESSAGE_VALUE['receiver'] as receiverr,(AMOUNT/1e6) as volume
           , 
           case 
           when SUBSTR(receiverr, 0, 4) = 'osmo' then 'osmo' 
           when SUBSTR(receiverr, 0, 4) = 'axel' then 'axelar' 
           when SUBSTR(receiverr, 0, 4) = 'grav' then 'GRAV' 
           when SUBSTR(receiverr, 0, 4) = 'secr' then 'secret' 
           when SUBSTR(receiverr, 0, 4) = 'terr' then 'terra' 
           when SUBSTR(receiverr, 0, 3) = 'cre' then 'CRE'
           when SUBSTR(receiverr, 0, 3) = 'sif' then 'SIF'
           when SUBSTR(receiverr, 0, 4) = 'kuji' then 'kujira'
           when SUBSTR(receiverr, 0, 4) = 'cosm' then 'cosmos'
           when SUBSTR(receiverr, 0, 4) = 'evmo' then 'evmos'
           when SUBSTR(receiverr, 0, 4) = 'stri' then 'STRI'
           when SUBSTR(receiverr, 0, 4) = 'juno' then 'juno'
           else null end as blockchain
         
           
           from terra.core.ez_transfers
         where 
         MESSAGE_TYPE='/ibc.applications.transfer.v1.MsgTransfer' and CURRENCY='uluna')
         
         
         select count(*) as number, sum(VOLUME) as volume , count(distinct SENDERR) as active_users ,BLOCKCHAIN,DATE from bridge_out 
         group by 4,5 order by date asc`
      },
      'Weekly-transaction-number': {
         result: null,
         sql: `select count(*) as number ,date_trunc('week', BLOCK_TIMESTAMP) as date from  terra.core.fact_transactions
         group by date`
      },
      'Cumulative-daily-fee-$': {
         result: null,
         sql: `with t1 as 
         (select sum(FEE) as fee , date_trunc('day',BLOCK_TIMESTAMP ) as date 
         from 
         terra.core.fact_transactions
         
         group by date )
         , 
           price as 
         (select avg(CLOSE) as price ,date_trunc('day',RECORDED_HOUR )  as datee from crosschain.core.fact_hourly_prices 
           where 
           ID = 'terra-luna-2'
         group by 2)
         
         select *,FEE*price as feeusd,
           sum(feeusd) over (order by date) as summ
           from t1 a inner join price b 
         on a.date=b.datee`
      },
      'Daily-fee-$': {
         result: null,
         sql: `with t1 as 
         (select sum(FEE) as fee , date_trunc('day',BLOCK_TIMESTAMP ) as date 
         from 
         terra.core.fact_transactions
         
         group by date )
         , 
           price as 
         (select avg(CLOSE) as price ,date_trunc('day',RECORDED_HOUR )  as datee from crosschain.core.fact_hourly_prices 
           where 
           ID = 'terra-luna-2'
         group by 2)
         
         select *,FEE*price as feeusd,
           sum(feeusd) over (order by date)
           from t1 a inner join price b 
         on a.date=b.datee`
      },
      'Average-Transaction-Fee-per-transaction-per-week-$': {
         result: null,
         sql: `with t1 as 
         (select avg(FEE) as fee , date_trunc('day',BLOCK_TIMESTAMP ) as date 
         from 
         terra.core.fact_transactions
         
         group by date )
         , 
           price as 
         (select avg(CLOSE) as price ,date_trunc('day',RECORDED_HOUR )  as datee from crosschain.core.fact_hourly_prices 
           where 
           ID = 'terra-luna-2'
         group by 2)
         , lom as 
         (select *,FEE*price as feeusd,
           sum(feeusd) over (order by date)
           from t1 a inner join price b 
         on a.date=b.datee)
         
         select date_trunc('week',date) as doty , avg(feeusd) 
         from lom
         group by 1 order by doty asc`
      },
      'Daily-number-of-new-wallet-contracts-deployed': {
         result: null,
         sql: `with t1 as 
         (select TX_SENDER, min(BLOCK_TIMESTAMP)   as ddd
         from
         terra.core.fact_transactions
         group by 1)
         select 
         count(*) as number , 
         date_trunc('day',ddd) as date
         from t1 a left join terra.core.dim_address_labels b 
         on a.TX_SENDER=b.ADDRESS
         group by date order by date asc`
      },
      'Daily-number-of-new-smart-contracts-deployed': {
         result: null,
         sql: `with t1 as
         (select  tx['body']['messages'][0]['contract'] as smart_contract, min(BLOCK_TIMESTAMP) as datee from
         terra.core.fact_transactions
           where 
           tx['body']['messages'][0]['contract'] is not null
         group by 1),
         t2 as 
         (select date_trunc(day,datee) as date, count(*) as number from t1 
         group by 1)
         
         select * , 
         sum(number) over (order by date) as numberr 
         from t2`
      },
      'Labeled-smart-contract-types-number': {
         result: null,
         sql: `select count(*) as number , LABEL_TYPE  from terra.core.dim_address_labels
         group by 2`
      },
      'Stable-coin-supply': {
         result: null,
         sql: `(select 
 
            sum(case when to_CURRENCY='ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4' then to_AMOUNT/1e6 else null end) -
            sum(case when FROM_CURRENCY='ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4' then FROM_AMOUNT/1e6 else null end) as volume, 'AXlusdc' as stablecoin
          
           
          from 
          
          terra.core.ez_swaps)
          
          union all 
          
          (select 
           
           
            sum(case when to_CURRENCY='terra1rwg5kt6kcyxtz69acjgpeut7dgr4y3r7tvntdxqt03dvpqktrfxq4jrvpq' then to_AMOUNT/1e6 else null end) as volume,'ust' as stablecoin
          
            
          from 
          
          terra.core.ez_swaps)
          
          
          union all 
          
          (select 
           
          
             sum(case when to_CURRENCY='terra1uc3r74qg44csdrl8hrm5muzlue9gf7umgkyv569pgazh7tudpr4qdtgqh6' then to_AMOUNT/1e6 else null end) as volume ,'usdc' as stablecoin
            
            
          from 
          
          terra.core.ez_swaps)
          
          
          
          union all 
          
          (select 
           
           
             sum(case when to_CURRENCY='terra1ery8l6jquynn9a4cz2pff6khg8c68f7urt33l5n9dng2cwzz4c4qj3spm2' then to_AMOUNT/1e6 else null end) as volume , 'usdt' as stablecoin
            
          from 
          
          terra.core.ez_swaps)
          
          union all 
          
          
          
          (select 
           
            -sum(case when to_CURRENCY='ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF' then to_AMOUNT/1e6 else null end) +
            sum(case when FROM_CURRENCY='ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF' then FROM_AMOUNT/1e6 else null end) as volume, 'AXlusdt' as stablecoin
          
            
          from 
          terra.core.ez_swaps
            
          )
          
            `
      }
   },

};

const getters = {
   getQueries(state) {
      return state.queries;
   },
};

const mutations = {
   setQueryResult(state, data) { // data => query, result
      state.queries[data.query].result = data.result;
   },
};



export default {
   namespaced: true,
   state,
   getters,
   mutations,
};
