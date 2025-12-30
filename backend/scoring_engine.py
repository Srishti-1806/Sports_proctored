import math

def calculate_score(correct_reps, total_reps, avg_deviation):
    """
    Ek advanced scoring system jo repetition quality aur posture consistency ko 
    balance karta hai.
    """
    try:
        # 1. Repetition Accuracy (Kitne reps sahi perform kiye)
        # Agar total 0 hai toh 0 return karega division error se bachne ke liye
        rep_accuracy = correct_reps / max(total_reps, 1)

        # 2. Posture Quality (Gaussian Decay logic)
        # Sigma decide karta hai ki kitni deviation "acceptable" hai.
        # 15 degree tak ka error "okay" mana jata hai professional level par.
        sigma = 15 
        posture_quality = math.exp(-(avg_deviation**2) / (2 * (sigma**2)))

        # 3. Weighted Final Score
        # 60% weightage correct reps ko aur 40% posture ki quality ko
        final_score = (0.6 * rep_accuracy + 0.4 * posture_quality) * 100

        # Max 100, Min 0 aur 2 decimal places tak round
        return max(0.0, min(100.0, round(final_score, 2)))

    except Exception as e:
        print(f"Scoring Error: {e}")
        return 0.0