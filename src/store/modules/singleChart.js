
const state = {
  queries: {
    'total-supply': {
      result: null,
      sql: `with t1 as (select sum(AMOUNT) as sent, SENDER from  terra.core.ez_transfers WHERE CURRENCY='uluna' group by 2), 
            t2 as 
            (select sum(AMOUNT) as rec, RECEIVER
            from 
            terra.core.ez_transfers
            WHERE
            CURRENCY='uluna'
            group by 2)
            select sum(rec)/1e4 as total_supply from t2 a left join t1 b on a.RECEIVER=b.SENDER 
            where sent is null
            limit 10`
    },
    'total-circulating': {
      result: null,
      sql: `with t1 as
            (select 
            sum(case when FROM_CURRENCY='uluna' then FROM_AMOUNT/1e6 else null end) as from_amountt,
            sum(case when to_CURRENCY='uluna' then FROM_AMOUNT/1e6 else null end) as to_amountt,
            from_amountt-to_amountt as circulating_volume,
              date_trunc('day',BLOCK_TIMESTAMP) as date
            from
              terra.core.ez_swaps
            group by date
            ), 
              t3 as
            
            (select 
            sum(circulating_volume) over (order by date) as circulating_supply , DATE from t1)
            
            select circulating_supply,  circulating_supply*100/1043378214 as ratio from t3 
            where 
            date='2022-12-11'`
    },
    'ratio-of-c/t': {
      result: null,
      sql: `with t1 as
            (select 
            sum(case when FROM_CURRENCY='uluna' then FROM_AMOUNT/1e6 else null end) as from_amountt,
            sum(case when to_CURRENCY='uluna' then FROM_AMOUNT/1e6 else null end) as to_amountt,
            from_amountt-to_amountt as circulating_volume,
              date_trunc('day',BLOCK_TIMESTAMP) as date
            from
              terra.core.ez_swaps
            group by date
            ), 
              t3 as
            
            (select 
            sum(circulating_volume) over (order by date) as circulating_supply , DATE from t1)
            
            select circulating_supply,  circulating_supply*100/1043378214 as ratio from t3 
            where 
            date='2022-12-11'`
    },
    'the-percentage-of-staked-LUNA': {
      result: null,
      sql: `select 
          (sum(case when ACTION in ('Delegate','Redelegate') then AMOUNT else null end) -sum(case when ACTION in ('Undelegate') then AMOUNT else null end))*100/1043000000
          from terra.core.ez_staking`
    },
    'total-staking-reward-in-dollars': {
      result: null,
      sql: `with t1 as 
      (select sum(AMOUNT)/1e6 as Staking_rewards,date_trunc('day',BLOCK_TIMESTAMP) as date
      from 
      terra.core.ez_transfers
      where 
        MESSAGE_VALUE['@type'] ='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
        and 
        CURRENCY='uluna'
      group by date),
        t2 as 
      
      (select
        avg(CLOSE) as price, date_trunc('day',RECORDED_HOUR) as datee from 
      crosschain.core.fact_hourly_prices
      where 
      ID = 'terra-luna-2'
      group by datee),
        
      t3 as
      (select *,STAKING_REWARDS*PRICE as sTAKING_REWARDS_USD from t1 a inner join t2 b
      on a.date=b.datee)
      , t4 as
      (select *, 
      sum(sTAKING_REWARDS_USD) over (order by date) as cumulative_sTAKING_REWARDS
      from t3)
      
      select cumulative_sTAKING_REWARDS from t4 
      where date='2022-12-11'`
    },
    'Number-of-reward-transaction': {
      result: null,
      sql: `select count(*) as number,count(distinct RECEIVER) as reward_reciver , 25.1*1e6/reward_reciver as rewarde_per_staker
      from 
      terra.core.ez_transfers 
      where 
      MESSAGE_VALUE['@type'] ='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
      and 
      CURRENCY='uluna'`
    },
    'Number-of-reward-reciever-average-reward': {
      result: null,
      sql: `select count(*) as number,count(distinct RECEIVER) as reward_reciver , 25.1*1e6/reward_reciver as rewarde_per_staker
      from 
      terra.core.ez_transfers 
      where 
        MESSAGE_VALUE['@type'] ='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
        and 
        CURRENCY='uluna'`
    },
    'Vesting-Schedule': {
      result: null,
      sql: `with ADDRESS as
      (Select ADDRESS
      from terra.core.dim_address_labels
      where LABEL_TYPE='defi'
      ),
      
        t2 as
      (select date_trunc('day',BLOCK_TIMESTAMP) as date ,sum(AMOUNT)/1e6 as amount_in
      from terra.core.ez_transfers
      where 
      RECEIVER in (select ADDRESS from ADDRESS) and CURRENCY='uluna'
      group by 1),
      
      t3 as 
      
      (select date_trunc('day',BLOCK_TIMESTAMP) as datee ,sum(AMOUNT)/1e6 as amount_out
      from terra.core.ez_transfers
      where 
      sender in (select ADDRESS from ADDRESS) and CURRENCY='uluna'
      group by 1
      ),
      asd as
      (select * from t2 a inner join t3 b  
      on a.date=b.datee),
      
      ltp as 
      (select 
      FLOOR((sum(AMOUNT_IN) over (order by date))/1000) as AMOUNT_INn,
       
      date
      from asd ),
      
      lts as 
      (select 
      floor((sum(AMOUNT_OUT) over (order by date))/1000) as AMOUNT_outt, 
      datee
      from asd )
      
      select avg(DATEDIFF(day, DATE, DATEE))
      from ltp a inner join lts b
      on a.AMOUNT_INn=b.AMOUNT_outt
      where AMOUNT_outt!=0`
    },
    'the-total-volume-of-bridged-out-Luna': {
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
      
      
      select count(*) as number, sum(VOLUME) as volumee , count(distinct SENDERR) as active_users, volumee/number , volumee/active_users from bridge_out `
    },
    'The-total-transaction-number-of-bridge-out': {
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
      
      
      select count(*) as number, sum(VOLUME) as volumee , count(distinct SENDERR) as active_users, volumee/number , volumee/active_users from bridge_out `
    },
    'Total-number-of-wallet-contracts': {
      result: null,
      sql: `with ta as
      (select count(distinct TX_SENDER) from terra.core.fact_transactions),
      
      tb as 
      (select count(distinct address) from terra.core.dim_address_labels)
      
      select * from  ta full join tb`
    },
    'Total-number-of-smart-contracts': {
      result: null,
      sql: `select count(distinct (tx['body']['messages'][0]['contract'] )) from
      terra.core.fact_transactions
        where 
        tx['body']['messages'][0]['contract'] is not null
      limit 10`
    },
   
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
