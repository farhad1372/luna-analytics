
const state = {
  queries: {
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
            
            select circulating_supply, circulating_supply*100/1043378214 as ratio,date from t3 
            where date>'2022-8-11'`
    },
    'staking-action-volume': {
      result: null,
      sql: `with f as
            (select 
            sum(case when ACTION in ('Delegate','Redelegate') then AMOUNT else null end) as stake,
            sum(case when ACTION ='Undelegate' then AMOUNT else null end) as unstake,
            stake-unstake as net_flow,
            date_trunc('day',BLOCK_TIMESTAMP) as date
            from 
            terra.core.ez_staking
            group by date)
            
            select 
            sum(stake) over (order by date) as stakee,
            sum(unstake) over (order by date) as unstakee,
            sum(net_flow) over (order by date) as net_floww, * 
            from f order by date asc`
    },
    'Luna-in-and-out-from-Defis': {
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
            FLOOR((sum(AMOUNT_IN) over (order by date))) as AMOUNT_INn,
            floor((sum(AMOUNT_OUT) over (order by date))) as AMOUNT_outt,  
            date
            from asd )
            
            select * from ltp order by date asc`
    },
    'The-ratio-of-bridge-out-Luna-volume-to-the-circulating-supply-percent': {
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
            (select count(*) as number, sum(VOLUME) as volume , count(distinct SENDERR) as active_users ,DATE from bridge_out 
            group by 4),
             hkk as
            (select sum(volume) over (order by date) as Cumulative_volume ,
             volume, DATE as datee
            from sda), 
            
             t1 as
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
            
            select *,CUMULATIVE_VOLUME*100/CIRCULATING_SUPPLY from hkk a inner join t3 b 
              on a.datee=b.date
            
            where 
            date>'2022-8-11'`
    },
    'Daily-Luna2-price-$': {
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
          on a.date=b.datee order by date asc`
    },
    'Cumulative-daily-number-of-ew-wallet-contracts-deployed': {
      result: null,
      sql: `with t1 as 
      (select TX_SENDER, min(BLOCK_TIMESTAMP)   as ddd
      
        from
      terra.core.fact_transactions
      group by 1
        
        )
       , lamp as
      (select 
       count(*) as number , 
        date_trunc('day',ddd) as date
      from t1 a left join terra.core.dim_address_labels b 
        on a.TX_SENDER=b.ADDRESS
      group by date)
      
      select 
      sum(number) over (order by date) as number , 
      date 
      from lamp order by date asc`
    },
    'Daily-cumulative-number-of-new-smart-contracts-deployed': {
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
      from t2 order by date asc`
    },
    'daily-stable-coins-supply-trend': {
      result: null,
      sql: `with t1 as
      (select 
       
        sum(case when to_CURRENCY='ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4' then to_AMOUNT/1e6 else null end) -
        sum(case when FROM_CURRENCY='ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4' then FROM_AMOUNT/1e6 else null end) as AXlusdcc,
        -sum(case when to_CURRENCY='ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF' then to_AMOUNT/1e6 else null end) +
        sum(case when FROM_CURRENCY='ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF' then FROM_AMOUNT/1e6 else null end) as AXlusdtt,
        sum(case when to_CURRENCY='terra1rwg5kt6kcyxtz69acjgpeut7dgr4y3r7tvntdxqt03dvpqktrfxq4jrvpq' then to_AMOUNT/1e6 else null end) as ustt,
        sum(case when to_CURRENCY='terra1uc3r74qg44csdrl8hrm5muzlue9gf7umgkyv569pgazh7tudpr4qdtgqh6' then to_AMOUNT/1e6 else null end) as usdcc ,
        sum(case when to_CURRENCY='terra1ery8l6jquynn9a4cz2pff6khg8c68f7urt33l5n9dng2cwzz4c4qj3spm2' then to_AMOUNT/1e6 else null end) as usdtt ,
        date_trunc('week',BLOCK_TIMESTAMP ) as date
      from 
      terra.core.ez_swaps
        group by date)
      
      select 
      sum(AXlusdcc) over (order by date) as AXlusdc,
      sum(AXlusdtt) over (order by date) as AXlusdtt,
      sum(ustt) over (order by date) as ust,
      sum(usdcc) over (order by date) as usdc,
      sum(usdtt) over (order by date) as usdt,date 
      from 
      t1`
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
