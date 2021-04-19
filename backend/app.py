from flask import Flask, jsonify, request
import requests
import json
import time
from collections import OrderedDict
from flask_cors import CORS
import random
import pprint

app = Flask(__name__)
CORS(app)


@app.route('/invest_amount', methods=['GET', 'POST'])
def get_suggestion_for_stocks():
    req = request.get_json()
    amount_to_be_invested = int(req['amount_to_be_invested'])
    selected_strategies = set(req['selected_strategies'])

    strategies_count = len(selected_strategies)

    if strategies_count < 1 or strategies_count > 2:
        return jsonify({"error": "You must select atleast 1 or maximum 2 strategies"})

    if amount_to_be_invested < 5000:
        return jsonify({"error": "Amount to be invested must be more than 5000$"})

    strategies_for_recommendation = {
        "ethical": ["FB", "ADBE", "NSRGY"],
        "index": ["VTI", "IXUS", "ILTB"],
        "growth": ["AMZN", "GOOG", "NFLX"],
        "quality": ["MSFT", "AXSM", "KOD"],
        "value": ["HEBT", "EVER", "KRMD"]
    }

    stocks = []
    for strtategy in selected_strategies:
        stocks.extend(strategies_for_recommendation[strtategy])

    number_of_stocks_to_be_recommended = random.randint(
        3, max(3, (strategies_count * 3) - 1))

    random_indices_for_stocks = set()

    while len(random_indices_for_stocks) != number_of_stocks_to_be_recommended:
        random_indices_for_stocks.add(
            random.randint(0, strategies_count * 3 - 1))

    stock_prices = []
    stock_price_mapping = {}
    previous_stock_prices = OrderedDict()
    total_stock_prices = 0

    for index in random_indices_for_stocks:
        stock_symb = stocks[index]

        time_series = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + \
            stock_symb+"&apikey=PMJIWQS056B8SGZ9"

        print(stock_symb)

        time_series_response_check = json.loads(requests.request(
            "GET", time_series).text)

        time_series_response = time_series_response_check['Time Series (Daily)']

        days_count = 0
        prices = []
        for day in time_series_response:

            stock_price = float(time_series_response[day]["4. close"])
            if days_count == 0:
                stock_prices.append([stock_symb, stock_price])
                stock_price_mapping[stock_symb] = stock_price
                total_stock_prices += stock_price
            else:
                prices.append([day, stock_price])

            days_count += 1
            if days_count == 6:
                break
        previous_stock_prices[stock_symb] = prices

    temp_amt = amount_to_be_invested

    stock_prices.sort(key=lambda x: x[1], reverse=True)

    no_of_stocks_assigned = {}
    j = 0

    for i in range(number_of_stocks_to_be_recommended):
        cur_stock, cur_stock_price = stock_prices[j]
        if i < number_of_stocks_to_be_recommended - 1:
            random_amount = random.uniform(
                cur_stock_price + 1, temp_amt - total_stock_prices)
        else:
            random_amount = temp_amt
        no_of_units = random_amount // cur_stock_price
        total_amount_for_cur_stock = no_of_units * cur_stock_price
        no_of_stocks_assigned[cur_stock] = int(no_of_units)
        total_stock_prices -= cur_stock_price
        temp_amt -= total_amount_for_cur_stock
        j += 1

    portfolio_history = OrderedDict()
    for stk in previous_stock_prices:
        for day, price in previous_stock_prices[stk]:
            if day not in portfolio_history:
                portfolio_history[day] = 0
            portfolio_history[day] += round(price *
                                            no_of_stocks_assigned[stk], 2)

    stocks_invested = []
    for stock1 in no_of_stocks_assigned:
        stocks_invested.append(
            {'name': stock1, 'no_of_units': no_of_stocks_assigned[stock1], 'amount': stock_price_mapping[stock1]})

    result = {
        'invested_amount': round(amount_to_be_invested - temp_amt, 2),
        'history': portfolio_history,
        'invested_stocks': stocks_invested,
        'cur_selected_strategies': list(selected_strategies)
    }
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
