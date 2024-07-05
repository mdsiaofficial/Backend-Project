import mongoose from `mongoose`;



const subscriptionSchema = new mongoose.Schema({ 
  
}, { timestamps: true })



export const Subscription = mongoose.model('Subscription', subscriptionSchema)