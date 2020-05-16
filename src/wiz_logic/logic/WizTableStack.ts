import { checkPlayValidity, getWinningCard } from "./GameRules"
import Stack from "../../card_logic/logic/Stack"
import { Suit } from "../../card_logic/models/Card"
import IWizCard from "../models/WizCard"
import IWizTableStack from "../models/WizTableStack"

export class WizTableStack extends Stack implements IWizTableStack {
    suitRequired?: Suit
    cards: IWizCard[]
    constructor() {
        super([])
    }

    getWinningPlayer() : IPlayer {
        return (getWinningCard(this.cards, this.suitRequired) as IWizCard).ownerPlayer
    }

    playCard(card: IWizCard) : boolean {

        const isValid = checkPlayValidity(card, card.ownerPlayer.stack.cards,
                                          this.top(), this.suitRequired)

        if(isValid) {
            this.push(card)
            if(!this.suitRequired)
                this.suitRequired = card.suit
        }

        return isValid
    }
}