import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Simplistic ML model simulation since we don't have training data
# In a real app, we'd load a pickled scikit-learn model here

@app.route('/predict-risk', methods=['POST'])
def predict_risk():
    data = request.json
    location = data.get('location', {'lat': 0, 'lng': 0})
    weather = data.get('weather', 'clear').lower()
    
    # Simulate risk calculation
    risk = 0.2
    explanation = "Risk is baseline. Conditions are currently optimal."
    
    if weather in ['rain', 'heat', 'pollution']:
        risk += 0.3
        explanation = f"Risk elevated due to active {weather}. Proceed with caution on routes."
    elif weather in ['flood', 'road block']:
        risk += 0.6
        explanation = f"Critical structural risk detected: {weather}. Instant payout triggers are highly likely in this zone."
        
    risk = min(max(risk, 0.0), 1.0)
    random_variation = random.uniform(-0.05, 0.05)
    risk = min(max(risk + random_variation, 0.0), 1.0)
    
    return jsonify({
        'riskScore': round(risk, 4), 
        'explanation': explanation
    })

@app.route('/trust-score', methods=['POST'])
def trust_score():
    data = request.json
    claim_history = data.get('claimHistory', [])
    behavior = data.get('behavior', {})
    
    # Start with max score
    score = 100
    
    # Penalize for frequent claims
    if len(claim_history) > 5:
        score -= (len(claim_history) - 5) * 5
        
    # Penalize for bad behavior flags
    if behavior.get('gpsMismatch'):
        score -= 20
        
    score = max(score, 0)
    return jsonify({'trustScore': score})

@app.route('/income-loss', methods=['POST'])
def income_loss():
    data = request.json
    past_earnings = data.get('pastEarnings', 0)
    hours_lost = data.get('hoursLost', 0)
    
    # Simple heuristic
    avg_hourly = past_earnings / 40 if past_earnings > 0 else 15
    estimated_loss = avg_hourly * hours_lost
    
    return jsonify({'estimatedLoss': estimated_loss})

@app.route('/predictive-alerts', methods=['POST', 'GET'])
def predictive_alerts():
    # Simulated heuristic for forecasting
    alerts = []
    val = random.random()
    if val > 0.6:
        alerts.append("Expect heavy rain in 2 hours. High visibility impairment.")
    elif val > 0.8:
        alerts.append("Critical risk: Flash flood warnings issued for tomorrow.")
        
    if not alerts:
        alerts.append("No immediate environmental risks predicted.")
        
    return jsonify({'alerts': alerts})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
