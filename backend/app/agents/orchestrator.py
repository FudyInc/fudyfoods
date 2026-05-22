"""Autogen Agent Orchestrator"""

import autogen
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """Orchestrate multiple autonomous agents"""

    def __init__(self):
        self.config_list = [
            {
                "model": "gpt-4",
                "api_key": settings.openai_api_key,
            }
        ]
        self.agents = self._setup_agents()

    def _setup_agents(self):
        """Setup autogen agents"""
        try:
            # User proxy agent
            user_proxy = autogen.UserProxyAgent(
                name="user_proxy",
                system_message="A human admin.",
                code_execution_config={"last_n_messages": 2, "work_dir": "coding"},
                human_input_mode="NEVER",
            )

            # Sales Analyst Agent
            sales_analyst = autogen.AssistantAgent(
                name="sales_analyst",
                system_message="""You are a sales analyst for Fudyfoods. 
                Analyze sales data, identify trends, and provide insights.
                You have access to sales databases and can generate reports.""",
                llm_config={"config_list": self.config_list},
            )

            # Inventory Manager Agent
            inventory_manager = autogen.AssistantAgent(
                name="inventory_manager",
                system_message="""You are an inventory manager for Fudyfoods.
                Monitor stock levels, predict demand, and optimize inventory.
                You can recommend restocking and warn about low stock items.""",
                llm_config={"config_list": self.config_list},
            )

            # Marketing Agent
            marketing_agent = autogen.AssistantAgent(
                name="marketing_agent",
                system_message="""You are a marketing specialist for Fudyfoods.
                Analyze customer behavior, recommend pricing strategies,
                and suggest promotional campaigns.""",
                llm_config={"config_list": self.config_list},
            )

            logger.info("✅ Agents initialized successfully")

            return {
                "user_proxy": user_proxy,
                "sales_analyst": sales_analyst,
                "inventory_manager": inventory_manager,
                "marketing_agent": marketing_agent,
            }

        except Exception as e:
            logger.error(f"❌ Error initializing agents: {e}")
            raise

    async def run_analysis(self, task: str):
        """Run an analysis task with agents"""
        try:
            # Group chat for agents to collaborate
            groupchat = autogen.GroupChat(
                agents=list(self.agents.values()),
                messages=[],
                max_turn=10,
            )
            manager = autogen.GroupChatManager(groupchat=groupchat, llm_config={"config_list": self.config_list})

            self.agents["user_proxy"].initiate_chat(
                manager,
                message=task,
            )

            return groupchat.messages

        except Exception as e:
            logger.error(f"❌ Error running analysis: {e}")
            raise
